'use client';

import { useState } from 'react';
import { GeneratedImage, ProgressState } from '@/types';
import { downloadImage } from '@/utils/helpers';
import { Box, Typography, Button, Grid, IconButton, Avatar, Dialog, DialogTitle, DialogContent, LinearProgress, Paper, CircularProgress } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
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
    toast.success('Imagen descargada exitosamente!');
  };

  const isValidImage = (image: GeneratedImage) => {
    return (image.url && image.url !== '') || (image.base64 && image.base64 !== 'undefined');
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <ImageIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>Resultados</Typography>
        </Box>
        {images.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            {images.length} imagen{images.length !== 1 ? 'es' : ''}
          </Typography>
        )}
      </Box>

      {progress.isLoading && (
        <Box mb={3}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <CircularProgress size={20} color="primary" />
            <Typography variant="body2" textTransform="capitalize">{progress.stage}...</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress.progress} />
        </Box>
      )}

      {images.length === 0 && !progress.isLoading && (
        <Box textAlign="center" py={6}>
          <ImageIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
          <Typography color="text.secondary">Aún no se han editado imágenes</Typography>
          <Typography variant="caption" color="text.disabled" display="block" mt={1}>
            Sube una imagen y agrega un prompt de edición para comenzar
          </Typography>
        </Box>
      )}

      {images.length > 0 && (
        <Grid container spacing={2}>
          {images.map((image) => (
            <Grid item xs={12} key={image.id}>
              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: 'grey.50' }}>
                <Box position="relative">
                  {isValidImage(image) ? (
                    <Box
                      component="img"
                      src={image.url || `data:image/png;base64,${image.base64}`}
                      alt="Edited image"
                      sx={{ width: '100%', height: 192, objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => setSelectedImage(image)}
                    />
                  ) : (
                    <Box width="100%" height={192} display="flex" alignItems="center" justifyContent="center" bgcolor="grey.100">
                      <Typography color="text.disabled">Imagen no disponible</Typography>
                    </Box>
                  )}
                  <IconButton
                    onClick={() => setSelectedImage(image)}
                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                    aria-label="Ver imagen"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Box>
                <Box p={2}>
                  {image.metadata.revised_prompt && (
                    <Typography variant="body2" color="text.secondary" mb={1} sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {image.metadata.revised_prompt}
                    </Typography>
                  )}
                  <Button
                    onClick={() => handleDownload(image)}
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<DownloadIcon />}
                  >
                    Descargar
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={!!selectedImage} onClose={() => setSelectedImage(null)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Vista previa</Typography>
            <IconButton onClick={() => setSelectedImage(null)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
          {selectedImage && isValidImage(selectedImage) ? (
            <Box
              component="img"
              src={selectedImage.url || `data:image/png;base64,${selectedImage.base64}`}
              alt="Edited image"
              sx={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: 2 }}
            />
          ) : (
            <Box width={400} height={400} display="flex" alignItems="center" justifyContent="center" bgcolor="grey.100" borderRadius={2}>
              <Typography color="text.disabled">Imagen no disponible</Typography>
            </Box>
          )}
          {selectedImage && selectedImage.metadata.revised_prompt && (
            <Box position="absolute" bottom={24} left={24} right={24} bgcolor="rgba(0,0,0,0.7)" color="white" p={2} borderRadius={2}>
              <Typography variant="body2">{selectedImage.metadata.revised_prompt}</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
}