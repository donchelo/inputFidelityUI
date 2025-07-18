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

  async editImage(params: ImageEditingParams): Promise<ApiResponse & { errorObj?: EditImageError }> {
    try {
      // Usar el backend Python para edición
      const formData = new FormData();
      let fileToSend: File | null = null;
      if (params.image instanceof File) {
        fileToSend = params.image;
      } else if (Array.isArray(params.image) && params.image[0] instanceof File) {
        fileToSend = params.image[0];
      } else {
        return {
          success: false,
          error: 'Tipo de imagen no soportado para edición',
        };
      }
      formData.append('prompt', params.prompt);
      formData.append('image', fileToSend);

      const response = await fetch('http://localhost:8000/edit-image/', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data && data.image_base64) {
        return {
          success: true,
          data: [{ base64: data.image_base64, url: '', id: `img_${Date.now()}`, metadata: {} }]
        };
      } else {
        return {
          success: false,
          error: data?.error || 'No se pudo editar la imagen. Intenta con otra imagen o prompt.'
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
}

export const imageService = OpenAIImageService.getInstance();