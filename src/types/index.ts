
export interface ImageEditingParams {
  model: string;
  image: File | File[] | string;
  prompt: string;
  input_fidelity: 'low' | 'high';
  mask?: File;
  size?: string;
  quality?: 'auto' | 'low' | 'medium' | 'high';
  output_format?: 'png' | 'jpeg' | 'webp';
}

export interface GeneratedImage {
  id: string;
  url: string;
  base64?: string;
  metadata: {
    revised_prompt?: string;
    token_consumption?: number;
    generation_time?: number;
    model_used?: string;
  };
}

export interface ApiResponse {
  success: boolean;
  data?: GeneratedImage[];
  error?: string;
  partial_images?: string[];
}

export interface ImageUpload {
  file: File;
  preview: string;
  id: string;
}

export interface ProgressState {
  isLoading: boolean;
  progress: number;
  stage: 'idle' | 'uploading' | 'processing' | 'generating' | 'complete';
  partialImages: string[];
}

export interface UseCase {
  id: string;
  name: string;
  description: string;
  examples: string[];
  bestPractices: string[];
  recommendedSettings: Partial<ImageEditingParams>;
}

export interface TokenCost {
  generation: {
    low: { square: number; portrait: number; landscape: number };
    medium: { square: number; portrait: number; landscape: number };
    high: { square: number; portrait: number; landscape: number };
  };
  editing: {
    low_fidelity: { base: number; tile: number };
    high_fidelity: { base: number; additional: number };
  };
  partial_images: number;
}