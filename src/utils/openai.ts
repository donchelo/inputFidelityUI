import OpenAI from 'openai';
import { ImageGenerationParams, ImageEditingParams, ApiResponse } from '@/types';
import { convertToRGBA } from './helpers';

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
      // Usar la API directa de OpenAI para edición
      let originalFile: File;
      
      if (params.image instanceof File) {
        originalFile = params.image;
      } else if (Array.isArray(params.image) && params.image[0] instanceof File) {
        originalFile = params.image[0];
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

      // Convert image to RGBA format (required by OpenAI API)
      let imageFile: File;
      try {
        imageFile = await convertToRGBA(originalFile);
      } catch (conversionError) {
        return {
          success: false,
          error: 'Error al convertir la imagen al formato requerido',
          errorObj: {
            type: EditImageErrorType.Validation,
            message: 'No se pudo convertir la imagen al formato RGBA requerido por OpenAI',
            details: conversionError
          }
        };
      }

      // Usar la API de OpenAI para edición de imágenes
      const response = await this.client.images.edit({
        image: imageFile,
        prompt: params.prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'url',
      });

      return {
        success: true,
        data: response.data.map((item, index) => ({
          id: `edit_${Date.now()}_${index}`,
          url: item.url || '',
          base64: '',
          metadata: {
            revised_prompt: item.revised_prompt,
            generation_time: Date.now(),
            model_used: params.model,
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

  async generateImage(params: ImageGenerationParams): Promise<ApiResponse> {
    try {
      // Usar la API de OpenAI para generación de imágenes
      const response = await this.client.images.generate({
        prompt: params.input,
        n: 1,
        size: params.size === 'auto' ? '1024x1024' : params.size,
        response_format: 'url',
      });

      return {
        success: true,
        data: response.data.map((item, index) => ({
          id: `gen_${Date.now()}_${index}`,
          url: item.url || '',
          base64: '',
          metadata: {
            revised_prompt: item.revised_prompt,
            generation_time: Date.now(),
            model_used: 'dall-e-3',
          },
        })),
      };
    } catch (error: any) {
      console.error('Image generation error:', error);
      
      let errorMessage = 'Error desconocido';
      
      if (error?.status === 400) {
        errorMessage = 'Error de validación en el prompt';
      } else if (error?.status === 401) {
        errorMessage = 'API Key de OpenAI inválida o no configurada';
      } else if (error?.status === 429) {
        errorMessage = 'Límite de rate de la API alcanzado';
      } else if (error?.status === 500) {
        errorMessage = 'Error interno del servidor de OpenAI';
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : errorMessage,
      };
    }
  }

  async streamGeneration(
    params: ImageGenerationParams,
    onPartialImage: (image: string, index: number) => void
  ): Promise<ApiResponse> {
    // Para simplificar, usamos la generación normal sin streaming
    // ya que la API de OpenAI no soporta streaming nativo para imágenes
    return this.generateImage(params);
  }
}

export const imageService = OpenAIImageService.getInstance();