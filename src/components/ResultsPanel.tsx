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
    <Paper elevation={1} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'grey.50', boxShadow: 1, minHeight: 340 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <ImageIcon color="primary" fontSize="small" />
          <Typography variant="subtitle1" fontWeight={600}>Resultados</Typography>
        </Box>
        {images.length > 0 && (
          <Typography variant="caption" color="text.secondary">
            {images.length} imagen{images.length !== 1 ? 'es' : ''}
          </Typography>
        )}
      </Box>
      {progress.isLoading && (
        <Box mb={1}>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <CircularProgress size={16} color="primary" />
            <Typography variant="caption" textTransform="capitalize">{progress.stage}...</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress.progress} sx={{ height: 4, borderRadius: 2 }} />
        </Box>
      )}
      {images.length === 0 && !progress.isLoading && (
        <Box textAlign="center" py={2}>
          <ImageIcon sx={{ fontSize: 32, color: 'grey.400', mb: 1 }} />
          <Typography color="text.secondary" variant="caption">Aún no se han editado imágenes</Typography>
          <Typography variant="caption" color="text.disabled" display="block">
            Sube una imagen y agrega un prompt para comenzar
          </Typography>
        </Box>
      )}
      {images.length > 0 && (
        <Grid container spacing={1}>
          {images.map((image) => (
            <Grid item xs={12} key={image.id}>
              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: 'grey.50', mb: 0.5 }}>
                <Box position="relative">
                  {isValidImage(image) ? (
                    <Box
                      component="img"
                      src={image.url || `data:image/png;base64,${image.base64}`}
                      alt="Edited image"
                      sx={{ width: '100%', height: 200, objectFit: 'contain', cursor: 'pointer' }}
                      onClick={() => setSelectedImage(image)}
                    />
                  ) : (
                    <Box width="100%" height={200} display="flex" alignItems="center" justifyContent="center" bgcolor="grey.100">
                      <Typography variant="caption" color="text.disabled">Imagen no disponible</Typography>
                    </Box>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => setSelectedImage(image)}
                    sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                    aria-label="Ver imagen"
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box p={1}>
                  {image.metadata.revised_prompt && (
                    <Typography variant="caption" color="text.secondary" mb={0.5} sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {image.metadata.revised_prompt}
                    </Typography>
                  )}
                  <Button
                    onClick={() => handleDownload(image)}
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="small"
                    startIcon={<DownloadIcon fontSize="small" />}
                    sx={{ mt: 0.5 }}
                  >
                    Descargar
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={!!selectedImage} onClose={() => setSelectedImage(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1">Vista previa</Typography>
            <IconButton size="small" onClick={() => setSelectedImage(null)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>
          {selectedImage && isValidImage(selectedImage) ? (
            <Box
              component="img"
              src={selectedImage.url || `data:image/png;base64,${selectedImage.base64}`}
              alt="Edited image"
              sx={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: 2 }}
            />
          ) : (
            <Box width={200} height={200} display="flex" alignItems="center" justifyContent="center" bgcolor="grey.100" borderRadius={2}>
              <Typography variant="caption" color="text.disabled">Imagen no disponible</Typography>
            </Box>
          )}
          {selectedImage && selectedImage.metadata.revised_prompt && (
            <Box position="absolute" bottom={16} left={16} right={16} bgcolor="rgba(0,0,0,0.7)" color="white" p={1} borderRadius={2}>
              <Typography variant="caption">{selectedImage.metadata.revised_prompt}</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
}