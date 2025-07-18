import OpenAI from 'openai';
import { ImageEditingParams, ApiResponse } from '@/types';

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

  async editImage(params: ImageEditingParams): Promise<ApiResponse & { errorObj?: EditImageError }> {
    try {
      // Preparar la imagen para gpt-image-1
      let imageInput: File | File[];
      
      if (params.image instanceof File) {
        imageInput = params.image;
      } else if (Array.isArray(params.image)) {
        imageInput = params.image;
      } else {
        return {
          success: false,
          error: 'Tipo de imagen no soportado para edición',
          errorObj: {
            type: EditImageErrorType.Validation,
            message: 'El tipo de imagen debe ser un archivo válido'
          }
        };
      }

      // Usar la API de OpenAI images.edit con gpt-image-1
      const response = await this.client.images.edit({
        model: "gpt-image-1",
        image: imageInput,
        prompt: params.prompt,
        input_fidelity: params.input_fidelity,
        quality: params.quality || "high",
        output_format: params.output_format || "jpeg",
        size: params.size || "1024x1024"
      });

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
      
      let errorType = EditImageErrorType.Unknown;
      let message = 'Error desconocido';
      
      if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
        errorType = EditImageErrorType.Network;
        message = 'Error de conexión con la API de OpenAI';
      } else if (error?.status === 400) {
        errorType = EditImageErrorType.Validation;
        message = 'Error de validación en los parámetros de entrada';
      } else if (error?.status === 401) {
        errorType = EditImageErrorType.API;
        message = 'API Key de OpenAI inválida o no configurada';
      } else if (error?.status === 429) {
        errorType = EditImageErrorType.API;
        message = 'Límite de rate de la API alcanzado';
      } else if (error?.status === 500) {
        errorType = EditImageErrorType.API;
        message = 'Error interno del servidor de OpenAI';
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        errorObj: {
          type: errorType,
          message,
          details: error
        }
      };
    }
  }

}

export const imageService = OpenAIImageService.getInstance();