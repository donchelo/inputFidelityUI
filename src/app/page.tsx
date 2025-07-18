'use client';

import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { GeneratedImage, ProgressState } from '@/types';
import ImageEditingPanel from '@/components/ImageEditingPanel';
import ResultsPanel from '@/components/ResultsPanel';
import { Box, Container, Typography, Grid, Paper, Divider } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';

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
    <Box minHeight="100vh" sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
      <Toaster position="top-right" />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={8}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
            <PaletteIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="h3" fontWeight={700} color="text.primary">
              GPT Image-1 Editor
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" maxWidth={600} mx="auto">
            Edita imágenes con alta fidelidad de entrada usando el modelo GPT Image-1 de OpenAI
          </Typography>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <ImageEditingPanel
              onImageEdited={handleImageEdited}
              onProgressUpdate={handleProgressUpdate}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <ResultsPanel
              images={editedImages}
              progress={progress}
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 8 }} />
        <Box component="footer" textAlign="center" color="text.secondary" fontSize={14}>
          <Typography>
            Powered by OpenAI's GPT Image-1 model with high input fidelity capabilities
          </Typography>
          <Typography mt={1}>
            Built with Next.js, React, and Material UI
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}