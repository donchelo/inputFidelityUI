'use client';

import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { GeneratedImage, ProgressState } from '@/types';
import ImageGenerationPanel from '@/components/ImageGenerationPanel';
import ImageEditingPanel from '@/components/ImageEditingPanel';
import ResultsPanel from '@/components/ResultsPanel';
import { Palette, Sparkles } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'generate' | 'edit'>('generate');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [progress, setProgress] = useState<ProgressState>({
    isLoading: false,
    progress: 0,
    stage: 'idle',
    partialImages: [],
  });

  const handleImageGenerated = (images: GeneratedImage[]) => {
    setGeneratedImages(prev => [...images, ...prev]);
  };

  const handleImageEdited = (images: GeneratedImage[]) => {
    setGeneratedImages(prev => [...images, ...prev]);
  };

  const handleProgressUpdate = (newProgress: ProgressState) => {
    setProgress(newProgress);
  };

  const handleImageSelect = (image: GeneratedImage) => {
    // Switch to edit tab when an image is selected for editing
    setActiveTab('edit');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-purple-600" />
            OpenAI Image Studio
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate and edit images with high input fidelity using OpenAI's GPT Image 1 model
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg border shadow-sm p-1">
                <nav className="flex space-x-1">
                  <button
                    onClick={() => setActiveTab('generate')}
                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                      activeTab === 'generate'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    Generate
                  </button>
                  <button
                    onClick={() => setActiveTab('edit')}
                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                      activeTab === 'edit'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Palette className="w-4 h-4" />
                    Edit
                  </button>
                </nav>
              </div>

              {activeTab === 'generate' && (
                <ImageGenerationPanel
                  onImageGenerated={handleImageGenerated}
                  onProgressUpdate={handleProgressUpdate}
                />
              )}

              {activeTab === 'edit' && (
                <ImageEditingPanel
                  onImageEdited={handleImageEdited}
                  onProgressUpdate={handleProgressUpdate}
                />
              )}
            </div>

            <div className="lg:col-span-1">
              <ResultsPanel
                images={generatedImages}
                progress={progress}
                onImageSelect={handleImageSelect}
              />
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>
            Powered by OpenAI's GPT Image 1 model with high input fidelity capabilities
          </p>
          <p className="mt-2">
            Built with Next.js, React, and Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
}