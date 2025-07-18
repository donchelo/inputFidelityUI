import OpenAI from 'openai';
import { ImageEditingParams, ApiResponse } from '@/types';

const client = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function editImage(params: ImageEditingParams): Promise<ApiResponse> {
  try {
    const editParams = {
      model: "gpt-image-1",
      image: params.image,
      prompt: params.prompt,
      input_fidelity: params.input_fidelity,
      quality: params.quality || "high",
      output_format: params.output_format || "jpeg",
      size: params.size || "1024x1024"
    };

    const response = await client.images.edit(editParams as any);

    if (!response.data || response.data.length === 0) {
      return {
        success: false,
        error: 'No se recibió respuesta de la API'
      };
    }

    return {
      success: true,
      data: response.data.map((item, index) => ({
        id: `edit_${Date.now()}_${index}`,
        url: item.url || '',
        base64: item.b64_json || '',
        metadata: {
          revised_prompt: item.revised_prompt,
          generation_time: Date.now(),
          model_used: 'gpt-image-1',
        },
      })),
    };

  } catch (error: any) {
    console.error('Image editing error:', error);
    
    let errorMessage = 'Error desconocido';
    
    if (error?.status === 400) {
      errorMessage = 'Error de validación en los parámetros';
    } else if (error?.status === 401) {
      errorMessage = 'API Key inválida o no configurada';
    } else if (error?.status === 429) {
      errorMessage = 'Límite de rate alcanzado';
    } else if (error?.status === 500) {
      errorMessage = 'Error interno del servidor';
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : errorMessage,
    };
  }
}