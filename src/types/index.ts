export interface ImageEditingParams {
  model: string;
  image: File | File[];
  prompt: string;
  input_fidelity: 'low' | 'high';
  mask?: File;
  size?: '1024x1024' | '256x256' | '512x512' | '1536x1024' | '1024x1536';
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
}