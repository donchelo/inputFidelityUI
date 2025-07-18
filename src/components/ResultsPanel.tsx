'use client';

import { useState } from 'react';
import { GeneratedImage, ProgressState } from '@/types';
import { downloadImage, copyToClipboard, cn } from '@/utils/helpers';
import { 
  Download, 
  Copy, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Share2, 
  Eye, 
  X, 
  Clock, 
  Zap, 
  Image as ImageIcon 
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ResultsPanelProps {
  images: GeneratedImage[];
  progress: ProgressState;
  onImageSelect?: (image: GeneratedImage) => void;
}

export default function ResultsPanel({ images, progress, onImageSelect }: ResultsPanelProps) {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleDownload = (image: GeneratedImage) => {
    const url = image.url || `data:image/png;base64,${image.base64}`;
    downloadImage(url, `generated-image-${image.id}.png`);
    toast.success('Image downloaded successfully!');
  };

  const handleCopyUrl = async (image: GeneratedImage) => {
    try {
      const url = image.url || `data:image/png;base64,${image.base64}`;
      await copyToClipboard(url);
      toast.success('Image URL copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const handleShare = async (image: GeneratedImage) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Generated Image',
          text: image.metadata.revised_prompt || 'Check out this AI-generated image!',
          url: image.url,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      handleCopyUrl(image);
    }
  };

  const openImageModal = (image: GeneratedImage) => {
    setSelectedImage(image);
    setZoomLevel(1);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setZoomLevel(1);
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <div className="bg-card border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Results
        </h2>
        {images.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {images.length} image{images.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {progress.isLoading && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm capitalize">{progress.stage}...</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.progress}%` }}
            />
          </div>

          {progress.partialImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {progress.partialImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={`data:image/png;base64,${image}`}
                    alt={`Partial ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border opacity-70"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      Preview {index + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {images.length === 0 && !progress.isLoading && (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No images generated yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Use the panels above to generate or edit images
          </p>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => {
            const hasValidUrl = Boolean(image.url && image.url !== '');
            const hasValidBase64 = Boolean(image.base64 && image.base64 !== 'undefined' && image.base64 !== '');
            return (
              <div key={image.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="relative group">
                  {hasValidUrl || hasValidBase64 ? (
                    <img
                      src={hasValidUrl ? image.url : `data:image/png;base64,${image.base64}`}
                      alt="Generated image"
                      className="w-full h-48 object-cover cursor-pointer image-preview"
                      onClick={() => openImageModal(image)}
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-400">
                      <ImageIcon className="w-12 h-12" />
                      <span className="ml-2">Imagen no disponible</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => openImageModal(image)}
                      className="bg-white/90 hover:bg-white text-black rounded-full p-2 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {image.metadata.revised_prompt && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {image.metadata.revised_prompt}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    {image.metadata.token_consumption && (
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {image.metadata.token_consumption.toLocaleString()} tokens
                      </div>
                    )}
                    {image.metadata.generation_time && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(image.metadata.generation_time).toLocaleTimeString()}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(image)}
                      className="flex-1 bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    
                    <button
                      onClick={() => handleCopyUrl(image)}
                      className="bg-secondary text-secondary-foreground px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary/90 flex items-center justify-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleShare(image)}
                      className="bg-secondary text-secondary-foreground px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary/90 flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    {onImageSelect && (
                      <button
                        onClick={() => onImageSelect(image)}
                        className="bg-accent text-accent-foreground px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/90 flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <button
                onClick={zoomOut}
                className="bg-white/90 hover:bg-white text-black rounded-full p-2 transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={resetZoom}
                className="bg-white/90 hover:bg-white text-black rounded-full p-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={zoomIn}
                className="bg-white/90 hover:bg-white text-black rounded-full p-2 transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={closeModal}
                className="bg-white/90 hover:bg-white text-black rounded-full p-2 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Validación de imagen ampliada */}
            {(selectedImage.url && selectedImage.url !== '') || (selectedImage.base64 && selectedImage.base64 !== 'undefined' && selectedImage.base64 !== '') ? (
              <img
                src={selectedImage.url && selectedImage.url !== '' ? selectedImage.url : `data:image/png;base64,${selectedImage.base64}`}
                alt="Generated image"
                className="max-w-full max-h-full object-contain transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            ) : (
              <div className="w-[400px] h-[400px] flex flex-col items-center justify-center bg-gray-100 text-gray-400 rounded-lg">
                <ImageIcon className="w-16 h-16 mb-2" />
                <span>Imagen no disponible</span>
              </div>
            )}

            {selectedImage.metadata.revised_prompt && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-4 rounded-lg">
                <p className="text-sm">{selectedImage.metadata.revised_prompt}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}