'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageEditingParams, ImageUpload, ProgressState } from '@/types';
import { isValidImageFormat, createImagePreview, formatFileSize, generateUniqueId, cn, calculateTokenCost } from '@/utils/helpers';
import { editImage } from '@/utils/openai';
import { Edit3, Upload, X, Info, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Box, Typography, Button, TextField, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel, LinearProgress, Grid, IconButton, Paper, Avatar, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface ImageEditingPanelProps {
  onImageEdited: (images: any[]) => void;
  onProgressUpdate: (progress: ProgressState) => void;
}

function validateImage(file: File): string | null {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
  const maxSizeMB = 50;

  if (!validTypes.includes(file.type)) {
    return 'Formato no soportado. Usa PNG, JPEG, WEBP o GIF.';
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return 'La imagen supera el tamaño máximo de 50 MB.';
  }

  return null;
}

export default function ImageEditingPanel({ 
  onImageEdited, 
  onProgressUpdate 
}: ImageEditingPanelProps) {
  const [uploadedImages, setUploadedImages] = useState<ImageUpload[]>([]);
  const [editPrompt, setEditPrompt] = useState('');
  const [inputFidelity, setInputFidelity] = useState<'low' | 'high'>('high');
  const [isEditing, setIsEditing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(async (file) => {
      const error = validateImage(file);
      if (error) {
        toast.error(error);
        return;
      }

      try {
        const preview = await createImagePreview(file);
        const newImage: ImageUpload = {
          file,
          preview,
          id: generateUniqueId(),
        };
        setUploadedImages(prev => [...prev, newImage]);
      } catch (error) {
        toast.error(`No se pudo procesar ${file.name}`);
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
      'image/gif': ['.gif'],
    },
    multiple: true,
  });

  const removeImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleEdit = async () => {
    if (uploadedImages.length === 0) {
      toast.error('Por favor, sube al menos una imagen');
      return;
    }

    if (!editPrompt.trim()) {
      toast.error('Por favor, ingresa un prompt de edición');
      return;
    }

    setIsEditing(true);
    onProgressUpdate({
      isLoading: true,
      progress: 50,
      stage: 'processing',
    });

    try {
      const params: ImageEditingParams = {
        model: 'gpt-image-1',
        image: uploadedImages.length === 1 ? uploadedImages[0].file : uploadedImages.map(img => img.file),
        prompt: editPrompt,
        input_fidelity: inputFidelity,
        quality: 'high',
        output_format: 'jpeg',
        size: '1024x1024',
      };

      const response = await editImage(params);

      if (response.success && response.data) {
        onImageEdited(response.data);
        toast.success('¡Imagen editada exitosamente!');
      } else {
        toast.error(response.error || 'No se pudo editar la imagen');
      }
    } catch (error) {
      console.error('Edit error:', error);
      toast.error('Ocurrió un error inesperado al editar la imagen');
    } finally {
      setIsEditing(false);
      onProgressUpdate({
        isLoading: false,
        progress: 100,
        stage: 'complete',
      });
    }
  };

  const estimatedTokens = calculateTokenCost('high', '1024x1024', inputFidelity);

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <EditIcon color="primary" />
        <Typography variant="h6" fontWeight={600}>Edición de Imagen</Typography>
      </Box>
      <Box component="form" noValidate autoComplete="off">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormLabel component="legend" sx={{ mb: 1 }}>Subir imágenes *</FormLabel>
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'grey.400',
                bgcolor: isDragActive ? 'primary.lighter' : 'background.paper',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
            >
              <input {...getInputProps()} />
              <CloudUploadIcon sx={{ fontSize: 40, color: 'grey.400', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {isDragActive ? 'Suelta las imágenes aquí...' : 'Arrastra y suelta imágenes aquí, o haz clic para seleccionar'}
              </Typography>
              <Typography variant="caption" color="text.disabled" display="block" mt={1}>
                PNG, JPEG, WebP, GIF (máx 50MB cada una)
              </Typography>
            </Box>
          </Grid>
          {uploadedImages.length > 0 && (
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {uploadedImages.map((image) => (
                  <Grid item xs={6} md={4} key={image.id}>
                    <Box position="relative">
                      <Avatar
                        variant="rounded"
                        src={image.preview}
                        alt="Upload preview"
                        sx={{ width: '100%', height: 100, borderRadius: 2, border: 1, borderColor: 'grey.300', objectFit: 'cover' }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeImage(image.id)}
                        sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
                        aria-label="Eliminar imagen"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <Box position="absolute" bottom={4} left={4} bgcolor="rgba(0,0,0,0.5)" color="white" px={1} py={0.5} borderRadius={1} fontSize={12}>
                        {formatFileSize(image.file.size)}
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
          <Grid item xs={12}>
            <FormLabel component="legend" sx={{ mb: 1 }}>Prompt de edición *</FormLabel>
            <TextField
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              placeholder="Describe cómo quieres editar la imagen..."
              multiline
              minRows={4}
              fullWidth
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Fidelidad de entrada</FormLabel>
              <RadioGroup
                row
                value={inputFidelity}
                onChange={(e) => setInputFidelity(e.target.value as 'low' | 'high')}
              >
                <FormControlLabel value="low" control={<Radio color="primary" />} label="Baja fidelidad - Procesamiento más rápido" />
                <FormControlLabel value="high" control={<Radio color="primary" />} label="Alta fidelidad - Preserva rostros, logos y detalles" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between" borderTop={1} borderColor="grey.200" pt={2}>
            <Typography variant="body2" color="text.secondary">
              Tokens estimados: {estimatedTokens.toLocaleString()}
            </Typography>
            <Button
              onClick={handleEdit}
              disabled={isEditing || uploadedImages.length === 0 || !editPrompt.trim()}
              variant="contained"
              color="primary"
              startIcon={isEditing ? <CircularProgress size={18} color="inherit" /> : <EditIcon />}
              sx={{ minWidth: 140 }}
            >
              {isEditing ? 'Editando...' : 'Editar imagen'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}