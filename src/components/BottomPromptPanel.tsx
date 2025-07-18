import React from 'react';
import { Box, Paper, TextField, Typography, Button, CircularProgress, Popover, List, ListItemButton, ListItemText } from '@mui/material';
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const fidelityLabel = inputFidelity === 'high' ? 'Alta' : 'Baja';

  const handleFidelityClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleFidelityClose = () => {
    setAnchorEl(null);
  };
  const handleFidelitySelect = (value: 'low' | 'high') => {
    setInputFidelity(value);
    setAnchorEl(null);
  };

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
        <Box display="flex" flexDirection="column" alignItems="flex-end" gap={0.5} minWidth={120}>
          <Typography variant="caption" sx={{ fontSize: 13, mb: 0.5, color: 'text.secondary' }}>Fidelidad</Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleFidelityClick}
            sx={{ textTransform: 'none', fontWeight: 500, borderRadius: 2, minWidth: 90 }}
            aria-describedby="fidelity-popover"
          >
            {fidelityLabel}
          </Button>
          <Popover
            id="fidelity-popover"
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleFidelityClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{ sx: { minWidth: 120, p: 0 } }}
          >
            <List dense disablePadding>
              <ListItemButton
                selected={inputFidelity === 'low'}
                onClick={() => handleFidelitySelect('low')}
              >
                <ListItemText primary={<Typography fontSize={14}>Baja</Typography>} />
              </ListItemButton>
              <ListItemButton
                selected={inputFidelity === 'high'}
                onClick={() => handleFidelitySelect('high')}
              >
                <ListItemText primary={<Typography fontSize={14}>Alta</Typography>} />
              </ListItemButton>
            </List>
          </Popover>
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
              mt: 1
            }}
          >
            {isEditing ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <ArrowUpwardIcon fontSize="medium" />
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default BottomPromptPanel; 