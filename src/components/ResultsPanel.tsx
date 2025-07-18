'use client';

import { useState } from 'react';
import { GeneratedImage, ProgressState } from '@/types';
import { downloadImage } from '@/utils/helpers';
import { Download, Eye, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface ResultsPanelProps {
  images: GeneratedImage[];
  progress: ProgressState;
}

export default function ResultsPanel({ images, progress }: ResultsPanelProps) {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const handleDownload = (image: GeneratedImage) => {
    const url = image.url || `data:image/png;base64,${image.base64}`;
    downloadImage(url, `edited-image-${image.id}.jpg`);
    toast.success('Image downloaded successfully!');
  };

  const isValidImage = (image: GeneratedImage) => {
    return (image.url && image.url !== '') || (image.base64 && image.base64 !== 'undefined');
  };

  return (
    <div className="bg-white border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Results
        </h2>
        {images.length > 0 && (
          <span className="text-sm text-gray-500">
            {images.length} image{images.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {progress.isLoading && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm capitalize">{progress.stage}...</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
        </div>
      )}

      {images.length === 0 && !progress.isLoading && (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No images edited yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Upload an image and add an edit prompt to get started
          </p>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {images.map((image) => (
            <div key={image.id} className="bg-gray-50 rounded-lg border overflow-hidden">
              <div className="relative group">
                {isValidImage(image) ? (
                  <img
                    src={image.url || `data:image/png;base64,${image.base64}`}
                    alt="Edited image"
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">Image not available</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => setSelectedImage(image)}
                    className="bg-white/90 hover:bg-white text-black rounded-full p-2 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                {image.metadata.revised_prompt && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {image.metadata.revised_prompt}
                  </p>
                )}

                <button
                  onClick={() => handleDownload(image)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-black rounded-full p-2 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {isValidImage(selectedImage) ? (
              <img
                src={selectedImage.url || `data:image/png;base64,${selectedImage.base64}`}
                alt="Edited image"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="w-[400px] h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
                <span className="text-gray-400">Image not available</span>
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