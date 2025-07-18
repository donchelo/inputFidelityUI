import OpenAI from 'openai';
import { ImageGenerationParams, ImageEditingParams, ApiResponse } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Enum para tipos de error
export enum EditImageErrorType {
  Validation = 'VALIDATION',
  Network = 'NETWORK',
  API = 'API',
  Unknown = 'UNKNOWN',
}

export interface EditImageError {
  type: EditImageErrorType;
  message: string;
  details?: any;
}

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

  async editImage(params: ImageEditingParams): Promise<ApiResponse & { errorObj?: EditImageError }> {
    try {
      // Si la imagen es un archivo local, primero súbela y obtén el file_id
      let imageContent: any = null;
      if (params.image instanceof File) {
        const formData = new FormData();
        formData.append('file', params.image);
        formData.append('purpose', 'vision');
        // Subir el archivo y obtener el file_id
        const uploadResponse = await fetch('https://api.openai.com/v1/files', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
          },
          body: formData
        });
        const uploadData = await uploadResponse.json();
        if (!uploadData.id) {
          return {
            success: false,
            error: 'No se pudo subir la imagen a OpenAI',
            errorObj: {
              type: EditImageErrorType.API,
              message: 'No se pudo subir la imagen a OpenAI',
              details: uploadData
            }
          };
        }
        imageContent = { type: 'input_image', image_file: uploadData.id, detail: params.input_fidelity };
      } else if (typeof params.image === 'string') {
        // Si es una URL
        imageContent = { type: 'input_image', image_url: params.image, detail: params.input_fidelity };
      } else if (Array.isArray(params.image) && params.image[0] instanceof File) {
        // Solo tomamos la primera imagen para este flujo
        const formData = new FormData();
        formData.append('file', params.image[0]);
        formData.append('purpose', 'vision');
        const uploadResponse = await fetch('https://api.openai.com/v1/files', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
          },
          body: formData
        });
        const uploadData = await uploadResponse.json();
        if (!uploadData.id) {
          return {
            success: false,
            error: 'No se pudo subir la imagen a OpenAI',
            errorObj: {
              type: EditImageErrorType.API,
              message: 'No se pudo subir la imagen a OpenAI',
              details: uploadData
            }
          };
        }
        imageContent = { type: 'input_image', image_file: uploadData.id, detail: params.input_fidelity };
      } else {
        return {
          success: false,
          error: 'Tipo de imagen no soportado para edición con gpt-image-1',
        };
      }

      // Construir el request para Responses API
      const requestBody = {
        model: 'gpt-image-1',
        input: [
          {
            role: 'user',
            content: [
              { type: 'input_text', text: params.prompt },
              imageContent
            ]
          }
        ]
      };

      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
        },
        body: JSON.stringify(requestBody)
      });
      const data = await response.json();

      // Procesar la respuesta para extraer la imagen generada
      let imageBase64 = null;
      if (data && data.output && Array.isArray(data.output)) {
        const imgResult = data.output.find((o: any) => o.type === 'image_generation_call');
        if (imgResult && imgResult.result) {
          imageBase64 = imgResult.result;
        }
      }

      if (imageBase64) {
        return {
          success: true,
          data: [{ base64: imageBase64, url: '', id: `img_${Date.now()}`, metadata: {} }]
        };
      } else {
        return {
          success: false,
          error: 'La API respondió pero la imagen no es válida o no se pudo procesar.'
        };
      }
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