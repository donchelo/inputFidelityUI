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
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Box textAlign="center" mb={3}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
            <PaletteIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h5" fontWeight={600} color="text.primary">
              GPT Image-1 Editor
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" maxWidth={400} mx="auto">
            Edita imágenes con alta fidelidad usando el modelo GPT Image-1 de OpenAI
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <ImageEditingPanel
              onImageEdited={handleImageEdited}
              onProgressUpdate={handleProgressUpdate}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <ResultsPanel
              images={editedImages}
              progress={progress}
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Box component="footer" textAlign="center" color="text.secondary" fontSize={12}>
          <Typography>
            Powered by OpenAI GPT Image-1
          </Typography>
          <Typography mt={0.5}>
            Built with Next.js, React y MUI
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}