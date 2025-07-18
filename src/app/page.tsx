'use client';

import { useState, useRef, FormEvent } from 'react';
import { Toaster } from 'react-hot-toast';
import { GeneratedImage, ProgressState } from '@/types';
import ImageEditingPanel from '@/components/ImageEditingPanel';
import ResultsPanel from '@/components/ResultsPanel';
import { Box, Container, Typography, Grid, Paper, Divider, useTheme, useMediaQuery, TextField, Button } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import Image from 'next/image';

export default function Home() {
  const [editedImages, setEditedImages] = useState<GeneratedImage[]>([]);
  const [progress, setProgress] = useState<ProgressState>({
    isLoading: false,
    progress: 0,
    stage: 'idle',
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Estado para la "contraseña"
  const [input, setInput] = useState('');
  const [acceso, setAcceso] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const validarAcceso = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim() === 'TRUE') {
      setAcceso(true);
      setError('');
    } else {
      setError('Contraseña incorrecta.');
      setInput('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleImageEdited = (images: GeneratedImage[]) => {
    setEditedImages(prev => [...images, ...prev]);
  };

  const handleProgressUpdate = (newProgress: ProgressState) => {
    setProgress(newProgress);
  };

  // Si no hay acceso, mostrar pantalla de contraseña
  if (!acceso) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
        <Paper elevation={3} sx={{ p: 4, minWidth: 320, textAlign: 'center' }}>
          <Image src="/ai4u-isotipo.png" alt="AI4U Isotipo" width={40} height={40} style={{ marginBottom: 12, borderRadius: 4, objectFit: 'contain', display: 'inline-block' }} />
          <Typography variant="h6" mb={2}>Introduce la clave para acceder</Typography>
          <form onSubmit={validarAcceso} autoComplete="off">
            <TextField
              variant="outlined"
              value={input}
              onChange={e => { setInput(e.target.value); setError(''); }}
              fullWidth
              inputRef={inputRef}
              type="password"
              error={!!error}
              helperText={error || ' '}
              placeholder="Escribe la clave..."
              sx={{ mb: 2 }}
              autoFocus
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              /* disabled={!input.trim()} */
              type="submit"
              sx={{ fontWeight: 600 }}
            >
              Entrar
            </Button>
          </form>
        </Paper>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
      <Toaster position="top-right" />
      <Container maxWidth="md" sx={{ py: 3, pb: 16 }}>
        <Box textAlign="center" mb={3}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
            <Image src="/ai4u-logo.png" alt="AI4U Logo" width={80} height={32} style={{ borderRadius: 4, objectFit: 'contain' }} />
            <Typography variant="h5" fontWeight={600} color="text.primary">
              Editor de Imágenes IA
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" maxWidth={400} mx="auto">
            Edita imágenes fácilmente usando inteligencia artificial avanzada
          </Typography>
        </Box>
        <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <ImageEditingPanel
              onImageEdited={handleImageEdited}
              onProgressUpdate={handleProgressUpdate}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <ResultsPanel
              images={editedImages}
              progress={progress}
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
      </Container>
      <Box component="footer"
        position="fixed"
        bottom={0}
        left={0}
        width="100%"
        py={0.5}
        fontSize={11}
        bgcolor="background.paper"
        color="text.secondary"
        borderTop="1px solid"
        borderColor="grey.200"
        boxShadow={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={1}
        zIndex={1200}
      >
        <Image src="/ai4u-isotipo.png" alt="AI4U Isotipo" width={16} height={16} style={{ borderRadius: 3, objectFit: 'contain' }} />
        <span>Powered by AI4U</span>
      </Box>
    </Box>
  );
}