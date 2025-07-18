
PS C:\Users\chelo\OneDrive\Escritorio\Software\inputFidelityUI> npm run dev

> openai-image-generation-ui@1.0.0 dev
> next dev

  ▲ Next.js 14.2.30
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Starting...
 ⚠ Invalid next.config.js options detected: 
 ⚠     Expected object, received boolean at "experimental.serverActions"
 ⚠ See more info here: https://nextjs.org/docs/messages/invalid-next-config
 ⚠ Server Actions are available by default now, `experimental.serverActions` option can be safely removed.
 ✓ Ready in 2.4s
 ⚠ Found a change in next.config.js. Restarting the server to apply the changes...
  ▲ Next.js 14.2.30
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Starting...
 ✓ Ready in 2.6s
 ○ Compiling / ...
 ✓ Compiled / in 2.5s (787 modules)
 ⚠ Unsupported metadata viewport is configured in metadata export in /. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata themeColor is configured in metadata export in /. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 GET / 200 in 2962ms
 ✓ Compiled in 415ms (377 modules)
 ○ Compiling /_not-found ...
 ✓ Compiled /_not-found in 713ms (776 modules)
 ⚠ Unsupported metadata viewport is configured in metadata export in /.well-known/appspecific/com.chrome.devtools.json. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata themeColor is configured in metadata export in /.well-known/appspecific/com.chrome.devtools.json. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 GET /.well-known/appspecific/com.chrome.devtools.json 404 in 939ms
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageEditingParams, ImageUpload, ProgressState } from '@/types';
import { isValidImageFormat, createImagePreview, formatFileSize, generateUniqueId, cn } from '@/utils/helpers';
import { imageService } from '@/utils/openai';
import { Edit3, Upload, X, Info, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageEditingPanelProps {
  onImageEdited: (images: any[]) => void;
  onProgressUpdate: (progress: ProgressState) => void;
}

// Helper para logs solo en desarrollo
function devLog(...args: any[]) {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('[DEV LOG]', ...args);
  }
}

export default function ImageEditingPanel({ 
  onImageEdited, 
  onProgressUpdate 
}: ImageEditingPanelProps) {
  const [uploadedImages, setUploadedImages] = useState<ImageUpload[]>([]);
  const [maskImage, setMaskImage] = useState<ImageUpload | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [inputFidelity, setInputFidelity] = useState<'low' | 'high'>('high');
  const [isEditing, setIsEditing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      if (!isValidImageFormat(file)) {
        toast.error(`${file.name} is not a supported image format`);
        return false;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 50MB)`);
        return false;
      }
      return true;
    });

    validFiles.forEach(async (file) => {
      try {
        const preview = await createImagePreview(file);
        const newImage: ImageUpload = {
          file,
          preview,
          id: generateUniqueId(),
        };
        setUploadedImages(prev => [...prev, newImage]);
      } catch (error) {
        toast.error(`Failed to process ${file.name}`);
      }
    });
  }, []);

  const onMaskDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'image/png') {
      toast.error('Mask must be a PNG file with alpha channel');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error('Mask file is too large (max 50MB)');
      return;
    }

    createImagePreview(file).then(preview => {
      setMaskImage({
        file,
        preview,
        id: generateUniqueId(),
      });
    }).catch(() => {
      toast.error('Failed to process mask file');
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
      'image/gif': ['.gif'],
    },
    multiple: true,
  });

  const { 
    getRootProps: getMaskRootProps, 
    getInputProps: getMaskInputProps, 
    isDragActive: isMaskDragActive 
  } = useDropzone({
    onDrop: onMaskDrop,
    accept: {
      'image/png': ['.png'],
    },
    multiple: false,
  });

  const removeImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const removeMask = () => {
    setMaskImage(null);
  };

  const handleEdit = async () => {
    if (uploadedImages.length === 0) {
      toast.error('Por favor, sube al menos una imagen');
      return;
    }

    if (!editPrompt.trim()) {
      toast.error('Por favor, ingresa un prompt de edición');
      return;
    }

    setIsEditing(true);
    onProgressUpdate({
      isLoading: true,
      progress: 0,
      stage: 'processing',
      partialImages: [],
    });

    try {
      const params: ImageEditingParams = {
        model: 'gpt-image-1',
        image: uploadedImages.length === 1 ? uploadedImages[0].file : uploadedImages.map(img => img.file),
        prompt: editPrompt,
        input_fidelity: inputFidelity,
        mask: maskImage?.file,
        quality: 'auto',
        output_format: 'png',
      };

      devLog('Enviando petición de edición', params);
      const response = await imageService.editImage(params);
      devLog('Respuesta de edición', response);

      if (response.success && response.data) {
        // Validar que la imagen tenga url o base64 válido
        const imagenes = Array.isArray(response.data) ? response.data : [response.data];
        const imagenesValidas = imagenes.filter(img => (img.url && img.url !== '') || (img.base64 && img.base64 !== 'undefined' && img.base64 !== ''));
        if (imagenesValidas.length === 0) {
          devLog('La respuesta no contiene imágenes válidas', response.data);
          toast.error('La API respondió pero la imagen no es válida o no se pudo procesar. Intenta con otra imagen o prompt.');
          onImageEdited([]);
        } else {
          onImageEdited(imagenesValidas);
          toast.success('¡Imagen editada exitosamente!');
        }
      } else {
        // Manejo de errores mejorado
        if (response.errorObj) {
          switch (response.errorObj.type) {
            case 'VALIDATION':
              toast.error('Error de validación: ' + response.errorObj.message);
              break;
            case 'NETWORK':
              toast.error('Error de red. Por favor, verifica tu conexión e intenta de nuevo.');
              break;
            case 'API':
              toast.error('Error de la API de OpenAI: ' + response.errorObj.message + (response.error ? ` (${response.error})` : ''));
              break;
            default:
              toast.error('Error desconocido: ' + response.errorObj.message);
          }
        } else if (response.error && response.error.includes('500')) {
          toast.error('Error interno del servidor de OpenAI (500). Intenta de nuevo más tarde o revisa los parámetros de entrada.');
        } else {
          toast.error(response.error || 'No se pudo editar la imagen. Intenta con otra imagen o prompt.');
        }
        devLog('Error en la respuesta de edición', response);
      }
    } catch (error) {
      devLog('Error inesperado en edición', error);
      // eslint-disable-next-line no-console
      console.error('Edit error:', error);
      toast.error('Ocurrió un error inesperado al editar la imagen.');
    } finally {
      setIsEditing(false);
      onProgressUpdate({
        isLoading: false,
        progress: 100,
        stage: 'complete',
        partialImages: [],
      });
    }
  };

  return (
    <div className="bg-card border rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Edit3 className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Image Editing</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="uploadImagesInput" className="block text-sm font-medium mb-2">
            Upload Images *
          </label>
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
              isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"
            )}
          >
            <input {...getInputProps()} id="uploadImagesInput" name="uploadImagesInput" />
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">
              {isDragActive ? 'Drop images here...' : 'Drag & drop images here, or click to select'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPEG, WebP, GIF (max 50MB each)
            </p>
          </div>
        </div>

        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedImages.map((image) => (
              <div key={image.id} className="relative">
                <img
                  src={image.preview}
                  alt="Upload preview"
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {formatFileSize(image.file.size)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div>
          <label htmlFor="editPrompt" className="block text-sm font-medium mb-2">
            Edit Prompt *
          </label>
          <textarea
            id="editPrompt"
            name="editPrompt"
            value={editPrompt}
            onChange={(e) => setEditPrompt(e.target.value)}
            placeholder="Describe how you want to edit the image..."
            className="w-full px-3 py-2 border rounded-md min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Input Fidelity</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2" htmlFor="inputFidelityLow">
              <input
                type="radio"
                id="inputFidelityLow"
                name="inputFidelity"
                value="low"
                checked={inputFidelity === 'low'}
                onChange={(e) => setInputFidelity(e.target.value as 'low' | 'high')}
                className="text-primary"
              />
              <span className="text-sm">Low Fidelity - Faster processing, general editing</span>
            </label>
            <label className="flex items-center gap-2" htmlFor="inputFidelityHigh">
              <input
                type="radio"
                id="inputFidelityHigh"
                name="inputFidelity"
                value="high"
                checked={inputFidelity === 'high'}
                onChange={(e) => setInputFidelity(e.target.value as 'low' | 'high')}
                className="text-primary"
              />
              <span className="text-sm">High Fidelity - Preserves faces, logos, and fine details</span>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="maskImageInput" className="block text-sm font-medium mb-2">
            Mask Image (Optional)
          </label>
          <div
            {...getMaskRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
              isMaskDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"
            )}
          >
            <input {...getMaskInputProps()} id="maskImageInput" name="maskImageInput" />
            <ImageIcon className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">
              {isMaskDragActive ? 'Drop mask here...' : 'Upload mask for inpainting'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG with alpha channel only
            </p>
          </div>
        </div>

        {maskImage && (
          <div className="relative inline-block">
            <img
              src={maskImage.preview}
              alt="Mask preview"
              className="w-32 h-32 object-cover rounded-lg border"
            />
            <button
              onClick={removeMask}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">High fidelity mode is recommended for:</p>
              <ul className="list-disc ml-4 space-y-1">
                <li>Face preservation</li>
                <li>Logo and brand consistency</li>
                <li>Product photography</li>
                <li>Fashion retouching</li>
                <li>Detailed object editing</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={handleEdit}
            disabled={isEditing || uploadedImages.length === 0 || !editPrompt.trim()}
            className={cn(
              "px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium",
              "hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center gap-2"
            )}
          >
            {isEditing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Edit3 className="w-4 h-4" />
            )}
            {isEditing ? 'Editing...' : 'Edit Image'}
          </button>
        </div>
      </div>
    </div>
  );
}