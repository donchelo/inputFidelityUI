import React from 'react';
import { Box, Paper, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography, Button, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

interface BottomPromptPanelProps {
  editPrompt: string;
  setEditPrompt: (v: string) => void;
  inputFidelity: 'low' | 'high';
  setInputFidelity: (v: 'low' | 'high') => void;
  isEditing: boolean;
  handleEdit: () => void;
  uploadedImages: any[];
  estimatedTokens: number;
}

const BottomPromptPanel: React.FC<BottomPromptPanelProps> = ({
  editPrompt,
  setEditPrompt,
  inputFidelity,
  setInputFidelity,
  isEditing,
  handleEdit,
  uploadedImages,
  estimatedTokens,
}) => {
  return (
    <Box position="fixed" bottom={0} left={0} width="100%" zIndex={1300} sx={{ pointerEvents: 'none' }}>
      <Paper
        elevation={6}
        sx={{
          maxWidth: 700,
          mx: 'auto',
          mb: 4,
          borderRadius: 3,
          p: 2,
          bgcolor: 'background.paper',
          boxShadow: 8,
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'center' },
          gap: 2,
        }}
      >
        <TextField
          value={editPrompt}
          onChange={e => setEditPrompt(e.target.value)}
          placeholder="Describe cómo quieres editar la imagen..."
          multiline
          minRows={1}
          maxRows={3}
          fullWidth
          required
          variant="outlined"
          size="small"
          sx={{ flex: 2 }}
        />
        <FormControl component="fieldset" size="small" sx={{ minWidth: 120 }}>
          <FormLabel component="legend" sx={{ fontSize: 13 }}>Fidelidad</FormLabel>
          <RadioGroup
            row
            value={inputFidelity}
            onChange={e => setInputFidelity(e.target.value as 'low' | 'high')}
            sx={{ gap: 1 }}
          >
            <FormControlLabel value="low" control={<Radio size="small" color="primary" />} label={<Typography fontSize={12}>Baja</Typography>} />
            <FormControlLabel value="high" control={<Radio size="small" color="primary" />} label={<Typography fontSize={12}>Alta</Typography>} />
          </RadioGroup>
        </FormControl>
        <Box display="flex" flexDirection="column" alignItems="flex-end" gap={0.5} minWidth={120}>
          <Button
            onClick={handleEdit}
            disabled={isEditing || uploadedImages.length === 0 || !editPrompt.trim()}
            variant="contained"
            color="primary"
            size="medium"
            sx={{
              minWidth: 0,
              width: 48,
              height: 48,
              borderRadius: '50%',
              p: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 3,
            }}
          >
            {isEditing ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <ArrowUpwardIcon fontSize="medium" />
            )}
          </Button>
          <Typography variant="caption" color="text.secondary">
            Tokens estimados: {estimatedTokens.toLocaleString()}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default BottomPromptPanel; 