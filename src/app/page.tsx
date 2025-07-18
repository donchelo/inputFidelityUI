'use client';

import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { GeneratedImage, ProgressState } from '@/types';
import ImageEditingPanel from '@/components/ImageEditingPanel';
import ResultsPanel from '@/components/ResultsPanel';
import { Palette } from 'lucide-react';

export default function Home() {
  const [editedImages, setEditedImages] = useState<GeneratedImage[]>([]);
  const [progress, setProgress] = useState<ProgressState>({
    isLoading: false,
    progress: 0,
    stage: 'idle',
  });

  const handleImageEdited = (images: GeneratedImage[]) => {
    setEditedImages(prev => [...images, ...prev]);
  };

  const handleProgressUpdate = (newProgress: ProgressState) => {
    setProgress(newProgress);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Palette className="w-10 h-10 text-purple-600" />
            GPT Image-1 Editor
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Edit images with high input fidelity using OpenAI's GPT Image-1 model
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <ImageEditingPanel
                onImageEdited={handleImageEdited}
                onProgressUpdate={handleProgressUpdate}
              />
            </div>

            <div className="lg:col-span-1">
              <ResultsPanel
                images={editedImages}
                progress={progress}
              />
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>
            Powered by OpenAI's GPT Image-1 model with high input fidelity capabilities
          </p>
          <p className="mt-2">
            Built with Next.js, React, and Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
}