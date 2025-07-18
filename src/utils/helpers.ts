import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function isValidImageFormat(file: File): boolean {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
  return validTypes.includes(file.type);
}

export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function downloadImage(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function calculateTokenCost(
  quality: 'low' | 'medium' | 'high' = 'high',
  size: string,
  inputFidelity?: 'low' | 'high',
  partialImages?: number
): number {
  const baseCosts = {
    low: { square: 272, portrait: 408, landscape: 400 },
    medium: { square: 1056, portrait: 1584, landscape: 1568 },
    high: { square: 4160, portrait: 6240, landscape: 6208 },
  };

  const sizeType = size.includes('1024x1024') ? 'square' : 
                  size.includes('1024x1536') ? 'portrait' : 'landscape';

  // Validación para evitar errores si quality no es válido
  if (!baseCosts[quality]) {
    return 0;
  }

  let cost = baseCosts[quality][sizeType];

  if (inputFidelity === 'high') {
    const additionalCost = sizeType === 'square' ? 4096 : 6144;
    cost += additionalCost;
  }

  if (partialImages) {
    cost += partialImages * 100;
  }

  return cost;
}

export function validateImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const { width, height } = img;
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            reject(new Error('Failed to resize image'));
          }
        },
        file.type,
        0.9
      );
    };
    
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function convertToRGBA(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Draw the image on canvas
      ctx.drawImage(img, 0, 0);
      
      // Convert to PNG with alpha channel
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const convertedFile = new File([blob], file.name, {
              type: 'image/png',
              lastModified: Date.now(),
            });
            resolve(convertedFile);
          } else {
            reject(new Error('Failed to convert image to RGBA'));
          }
        },
        'image/png',
        1.0
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}