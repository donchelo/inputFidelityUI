'use client';

import { useState } from 'react';
import { ImageGenerationParams, ProgressState } from '@/types';
import { calculateTokenCost, cn } from '@/utils/helpers';
import { imageService } from '@/utils/openai';
import { Loader2, Wand2, Settings, Info } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageGenerationPanelProps {
  onImageGenerated: (images: any[]) => void;
  onProgressUpdate: (progress: ProgressState) => void;
}

export default function ImageGenerationPanel({ 
  onImageGenerated, 
  onProgressUpdate 
}: ImageGenerationPanelProps) {
  const [params, setParams] = useState<ImageGenerationParams>({
    model: 'gpt-image-1',
    input: '',
    size: 'auto',
    quality: 'auto',
    output_format: 'png',
    background: 'opaque',
    partial_images: 0,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [partialImages, setPartialImages] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!params.input.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    onProgressUpdate({
      isLoading: true,
      progress: 0,
      stage: 'generating',
      partialImages: [],
    });

    try {
      const response = await imageService.generateImage(params);
      
      if (response.success && response.data) {
        onImageGenerated(response.data);
        toast.success('Image generated successfully!');
      } else {
        toast.error(response.error || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('An error occurred while generating the image');
    } finally {
      setIsGenerating(false);
      onProgressUpdate({
        isLoading: false,
        progress: 100,
        stage: 'complete',
        partialImages: [],
      });
    }
  };

  const handleStreamGenerate = async () => {
    if (!params.input.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setPartialImages([]);
    
    onProgressUpdate({
      isLoading: true,
      progress: 0,
      stage: 'generating',
      partialImages: [],
    });

    try {
      const response = await imageService.streamGeneration(
        params,
        (partialImage: string, index: number) => {
          setPartialImages(prev => {
            const newImages = [...prev];
            newImages[index] = partialImage;
            return newImages;
          });
          
          onProgressUpdate({
            isLoading: true,
            progress: ((index + 1) / params.partial_images) * 80,
            stage: 'generating',
            partialImages: partialImages,
          });
        }
      );

      if (response.success && response.data) {
        onImageGenerated(response.data);
        toast.success('Image generated successfully!');
      } else {
        toast.error(response.error || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Streaming generation error:', error);
      toast.error('An error occurred while generating the image');
    } finally {
      setIsGenerating(false);
      setPartialImages([]);
      onProgressUpdate({
        isLoading: false,
        progress: 100,
        stage: 'complete',
        partialImages: [],
      });
    }
  };

  const estimatedTokens = calculateTokenCost(
    params.quality as 'low' | 'medium' | 'high',
    params.size,
    undefined,
    params.partial_images
  );

  return (
    <div className="bg-card border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Wand2 className="w-5 h-5" />
          Image Generation
        </h2>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <Settings className="w-4 h-4" />
          Advanced
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Prompt *
          </label>
          <textarea
            value={params.input}
            onChange={(e) => setParams({ ...params, input: e.target.value })}
            placeholder="Describe the image you want to generate..."
            className="w-full px-3 py-2 border rounded-md min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Size</label>
            <select
              value={params.size}
              onChange={(e) => setParams({ ...params, size: e.target.value as any })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="auto">Auto (Recommended)</option>
              <option value="1024x1024">Square (1024x1024)</option>
              <option value="1536x1024">Landscape (1536x1024)</option>
              <option value="1024x1536">Portrait (1024x1536)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quality</label>
            <select
              value={params.quality}
              onChange={(e) => setParams({ ...params, quality: e.target.value as any })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="auto">Auto (Recommended)</option>
              <option value="low">Low (Faster)</option>
              <option value="medium">Medium</option>
              <option value="high">High (Best Quality)</option>
            </select>
          </div>
        </div>

        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Output Format</label>
                <select
                  value={params.output_format}
                  onChange={(e) => setParams({ ...params, output_format: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="png">PNG (Default)</option>
                  <option value="jpeg">JPEG (Faster)</option>
                  <option value="webp">WebP (Smaller)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Background</label>
                <select
                  value={params.background}
                  onChange={(e) => setParams({ ...params, background: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="opaque">Opaque</option>
                  <option value="transparent">Transparent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Streaming Partial Images: {params.partial_images}
              </label>
              <input
                type="range"
                min="0"
                max="3"
                value={params.partial_images}
                onChange={(e) => setParams({ ...params, partial_images: Number(e.target.value) })}
                className="w-full"
              />
              <div className="text-sm text-muted-foreground mt-1">
                Number of partial images to show during generation
              </div>
            </div>

            {params.background === 'transparent' && 
             !['png', 'webp'].includes(params.output_format) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    Transparent background only works with PNG and WebP formats
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Estimated tokens: {estimatedTokens.toLocaleString()}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !params.input.trim()}
              className={cn(
                "px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium",
                "hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center gap-2"
              )}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              Generate
            </button>

            {params.partial_images > 0 && (
              <button
                onClick={handleStreamGenerate}
                disabled={isGenerating || !params.input.trim()}
                className={cn(
                  "px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-medium",
                  "hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed",
                  "flex items-center gap-2"
                )}
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
                Stream
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}