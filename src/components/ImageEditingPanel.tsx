'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageEditingParams, ImageUpload, ProgressState } from '@/types';
import { isValidImageFormat, createImagePreview, formatFileSize, generateUniqueId, cn, calculateTokenCost } from '@/utils/helpers';
import { editImage } from '@/utils/openai';
import { Edit3, Upload, X, Info, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageEditingPanelProps {
  onImageEdited: (images: any[]) => void;
  onProgressUpdate: (progress: ProgressState) => void;
}

function validateImage(file: File): string | null {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
  const maxSizeMB = 50;

  if (!validTypes.includes(file.type)) {
    return 'Formato no soportado. Usa PNG, JPEG, WEBP o GIF.';
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return 'La imagen supera el tamaño máximo de 50 MB.';
  }

  return null;
}

export default function ImageEditingPanel({ 
  onImageEdited, 
  onProgressUpdate 
}: ImageEditingPanelProps) {
  const [uploadedImages, setUploadedImages] = useState<ImageUpload[]>([]);
  const [editPrompt, setEditPrompt] = useState('');
  const [inputFidelity, setInputFidelity] = useState<'low' | 'high'>('high');
  const [isEditing, setIsEditing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(async (file) => {
      const error = validateImage(file);
      if (error) {
        toast.error(error);
        return;
      }

      try {
        const preview = await createImagePreview(file);
        const newImage: ImageUpload = {
          file,
          preview,
          id: generateUniqueId(),
        };
        setUploadedImages(prev => [...prev, newImage]);
      } catch (error) {
        toast.error(`No se pudo procesar ${file.name}`);
      }
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

  const removeImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
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
      progress: 50,
      stage: 'processing',
    });

    try {
      const params: ImageEditingParams = {
        model: 'gpt-image-1',
        image: uploadedImages.length === 1 ? uploadedImages[0].file : uploadedImages.map(img => img.file),
        prompt: editPrompt,
        input_fidelity: inputFidelity,
        quality: 'high',
        output_format: 'jpeg',
        size: '1024x1024',
      };

      const response = await editImage(params);

      if (response.success && response.data) {
        onImageEdited(response.data);
        toast.success('¡Imagen editada exitosamente!');
      } else {
        toast.error(response.error || 'No se pudo editar la imagen');
      }
    } catch (error) {
      console.error('Edit error:', error);
      toast.error('Ocurrió un error inesperado al editar la imagen');
    } finally {
      setIsEditing(false);
      onProgressUpdate({
        isLoading: false,
        progress: 100,
        stage: 'complete',
      });
    }
  };

  const estimatedTokens = calculateTokenCost('high', '1024x1024', inputFidelity);

  return (
    <div className="bg-white border rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Edit3 className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Image Editing</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Upload Images *
          </label>
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            )}
          >
            <input {...getInputProps()} />
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
          <label className="block text-sm font-medium mb-2">
            Edit Prompt *
          </label>
          <textarea
            value={editPrompt}
            onChange={(e) => setEditPrompt(e.target.value)}
            placeholder="Describe how you want to edit the image..."
            className="w-full px-3 py-2 border rounded-md min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Input Fidelity</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="low"
                checked={inputFidelity === 'low'}
                onChange={(e) => setInputFidelity(e.target.value as 'low' | 'high')}
                className="text-blue-600"
              />
              <span className="text-sm">Low Fidelity - Faster processing</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="high"
                checked={inputFidelity === 'high'}
                onChange={(e) => setInputFidelity(e.target.value as 'low' | 'high')}
                className="text-blue-600"
              />
              <span className="text-sm">High Fidelity - Preserves faces, logos, and details</span>
            </label>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">High fidelity preserves:</p>
              <ul className="list-disc ml-4 space-y-1">
                <li>Face preservation</li>
                <li>Logo and brand consistency</li>
                <li>Product photography details</li>
                <li>Fashion retouching quality</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            Estimated tokens: {estimatedTokens.toLocaleString()}
          </div>
          
          <button
            onClick={handleEdit}
            disabled={isEditing || uploadedImages.length === 0 || !editPrompt.trim()}
            className={cn(
              "px-6 py-2 bg-blue-600 text-white rounded-md font-medium",
              "hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",
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