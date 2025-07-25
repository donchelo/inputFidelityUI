'use client';

import React, { useState, useCallback, useRef } from 'react';
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
import BottomPromptPanel from '@/components/BottomPromptPanel';

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
  const [progressValue, setProgressValue] = useState(0);

  // Mejor práctica: useEffect para barra progresiva
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isEditing) {
      setProgressValue(0);
      onProgressUpdate({ isLoading: true, progress: 0, stage: 'processing' });
      interval = setInterval(() => {
        setProgressValue(prev => {
          if (prev >= 95) {
            clearInterval(interval!);
            return 95;
          }
          return prev + 0.56; // Avance calculado para 85s hasta 95%
        });
      }, 500); // 500ms por tick
    }
    // Guardar referencia global para limpiar desde handleEdit
    (window as any).__progressInterval = interval;
    return () => {
      if (interval) clearInterval(interval);
      (window as any).__progressInterval = null;
    };
  }, [isEditing]);

  // Sincronizar progreso visual con el padre
  React.useEffect(() => {
    if (isEditing && progressValue < 100) {
      onProgressUpdate({
        isLoading: true,
        progress: progressValue,
        stage: 'processing',
      });
    }
  }, [progressValue, isEditing]);

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
      // Limpiar el intervalo y completar la barra si la imagen se genera antes
      if ((window as any).__progressInterval) {
        clearInterval((window as any).__progressInterval);
        (window as any).__progressInterval = null;
      }
      onProgressUpdate({
        isLoading: false,
        progress: 100,
        stage: 'complete',
      });
      setProgressValue(100);
    }
  };

  const estimatedTokens = calculateTokenCost('high', '1024x1024', inputFidelity);

  return (
    <Box position="relative">
      <Paper elevation={1} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'grey.50', boxShadow: 1, minHeight: 340 }}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <EditIcon color="primary" fontSize="small" />
          <Typography variant="subtitle1" fontWeight={600}>Edición de Imagen</Typography>
        </Box>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12 }}>
            <FormLabel component="legend" sx={{ mb: 0.5, fontSize: 13 }}>Imagen *</FormLabel>
            {uploadedImages.length === 0 ? (
              <Box
                {...getRootProps()}
                sx={{
                  minHeight: 200,
                  p: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  border: '1.5px dashed',
                  borderColor: 'grey.300',
                }}
              >
                <input {...getInputProps()} />
                <CloudUploadIcon sx={{ fontSize: 28, color: 'grey.400', mb: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  {isDragActive ? 'Suelta aquí...' : 'Arrastra o haz clic para seleccionar'}
                </Typography>
                <Typography variant="caption" color="text.disabled" display="block">
                  PNG, JPEG, WebP, GIF (máx 50MB)
                </Typography>
              </Box>
            ) : (
              <Box
                position="relative"
                sx={{
                  border: '1.5px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  p: 0,
                  minHeight: 220,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  bgcolor: 'background.paper',
                }}
              >
                <Box
                  component="img"
                  src={uploadedImages[0].preview}
                  alt="Preview de la imagen subida"
                  sx={{ width: '100%', height: 200, objectFit: 'contain', borderRadius: 2 }}
                />
                <IconButton
                  size="small"
                  onClick={() => removeImage(uploadedImages[0].id)}
                  sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
                  aria-label="Eliminar imagen"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <Box position="absolute" bottom={4} left={4} bgcolor="rgba(0,0,0,0.5)" color="white" px={0.5} py={0.2} borderRadius={1} fontSize={10}>
                  {formatFileSize(uploadedImages[0].file.size)}
                </Box>
              </Box>
            )}
          </Grid>
          {uploadedImages.length > 1 && (
            <Grid size={{ xs: 12 }}>
              <Grid container spacing={1}>
                {uploadedImages.slice(1).map((image) => (
                  <Grid size={{ xs: 6, md: 4 }} key={image.id}>
                    <Box position="relative">
                      <Avatar
                        variant="rounded"
                        src={image.preview}
                        alt="Upload preview"
                        sx={{ width: '100%', height: 60, borderRadius: 2, border: 1, borderColor: 'grey.300', objectFit: 'cover' }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeImage(image.id)}
                        sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
                        aria-label="Eliminar imagen"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <Box position="absolute" bottom={2} left={2} bgcolor="rgba(0,0,0,0.5)" color="white" px={0.5} py={0.2} borderRadius={1} fontSize={10}>
                        {formatFileSize(image.file.size)}
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Paper>
      <BottomPromptPanel
        editPrompt={editPrompt}
        setEditPrompt={setEditPrompt}
        inputFidelity={inputFidelity}
        setInputFidelity={setInputFidelity}
        isEditing={isEditing}
        handleEdit={handleEdit}
        uploadedImages={uploadedImages}
        estimatedTokens={estimatedTokens}
      />
    </Box>
  );
}