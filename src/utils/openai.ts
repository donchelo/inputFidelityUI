import OpenAI from 'openai';
import { ImageGenerationParams, ImageEditingParams, ApiResponse } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export class OpenAIImageService {
  private static instance: OpenAIImageService;
  private client: OpenAI;

  private constructor() {
    this.client = openai;
  }

  public static getInstance(): OpenAIImageService {
    if (!OpenAIImageService.instance) {
      OpenAIImageService.instance = new OpenAIImageService();
    }
    return OpenAIImageService.instance;
  }

  async generateImage(params: ImageGenerationParams): Promise<ApiResponse> {
    try {
      const tools = [
        {
          type: 'image_generation' as const,
          ...(params.partial_images > 0 && { partial_images: params.partial_images }),
        },
      ];

      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: params.input,
          },
        ],
        tools,
        tool_choice: 'auto',
        max_tokens: 1000,
      });

      const toolCall = response.choices[0]?.message?.tool_calls?.[0];
      if (toolCall?.type === 'function' && toolCall.function.name === 'image_generation') {
        const imageData = JSON.parse(toolCall.function.arguments);
        
        return {
          success: true,
          data: [{
            id: `img_${Date.now()}`,
            url: imageData.url || '',
            base64: imageData.base64 || '',
            metadata: {
              revised_prompt: imageData.revised_prompt,
              token_consumption: response.usage?.total_tokens,
              generation_time: Date.now(),
              model_used: params.model,
            },
          }],
        };
      }

      return {
        success: false,
        error: 'No image generated',
      };
    } catch (error) {
      console.error('Image generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async editImage(params: ImageEditingParams): Promise<ApiResponse> {
    try {
      const formData = new FormData();
      
      if (params.image instanceof File) {
        formData.append('image', params.image);
      } else if (Array.isArray(params.image)) {
        params.image.forEach((file, index) => {
          formData.append(`image_${index}`, file);
        });
      }

      if (params.mask) {
        formData.append('mask', params.mask);
      }

      formData.append('prompt', params.prompt);
      formData.append('model', params.model);
      formData.append('input_fidelity', params.input_fidelity);
      
      if (params.size) formData.append('size', params.size);
      if (params.quality) formData.append('quality', params.quality);
      if (params.output_format) formData.append('output_format', params.output_format);

      const response = await this.client.images.edit({
        image: params.image as File,
        prompt: params.prompt,
        model: params.model as any,
        n: 1,
        size: params.size as any,
        response_format: 'url',
      });

      return {
        success: true,
        data: response.data.map((item, index) => ({
          id: `edit_${Date.now()}_${index}`,
          url: item.url || '',
          metadata: {
            revised_prompt: item.revised_prompt,
            generation_time: Date.now(),
            model_used: params.model,
          },
        })),
      };
    } catch (error) {
      console.error('Image editing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async streamGeneration(
    params: ImageGenerationParams,
    onPartialImage: (image: string, index: number) => void
  ): Promise<ApiResponse> {
    try {
      const tools = [
        {
          type: 'image_generation' as const,
          partial_images: params.partial_images,
        },
      ];

      const stream = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: params.input,
          },
        ],
        tools,
        tool_choice: 'auto',
        stream: true,
        max_tokens: 1000,
      });

      const partialImages: string[] = [];
      let finalResponse: any = null;

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta;
        
        if (delta?.tool_calls?.[0]?.function?.arguments) {
          try {
            const args = JSON.parse(delta.tool_calls[0].function.arguments);
            
            if (args.partial_image) {
              partialImages.push(args.partial_image);
              onPartialImage(args.partial_image, partialImages.length - 1);
            }
            
            if (args.final_image) {
              finalResponse = args;
            }
          } catch (parseError) {
            console.warn('Failed to parse streaming response:', parseError);
          }
        }
      }

      if (finalResponse) {
        return {
          success: true,
          data: [{
            id: `stream_${Date.now()}`,
            url: finalResponse.url || '',
            base64: finalResponse.base64 || '',
            metadata: {
              revised_prompt: finalResponse.revised_prompt,
              generation_time: Date.now(),
              model_used: params.model,
            },
          }],
          partial_images: partialImages,
        };
      }

      return {
        success: false,
        error: 'No final image received from stream',
      };
    } catch (error) {
      console.error('Streaming generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export const imageService = OpenAIImageService.getInstance();