import React, { useState } from 'react';
import { Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseIcon from '@mui/icons-material/Close';
import promptHelpContent from './promptHelpContent';
import ReactMarkdown from 'react-markdown';

const PromptHelpButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Fab
        color="primary"
        aria-label="Ayuda de prompt"
        onClick={handleOpen}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,
        }}
      >
        <HelpOutlineIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose} aria-labelledby="prompt-help-title">
        <DialogTitle id="prompt-help-title" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Guía de Prompts
          <IconButton aria-label="cerrar" onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <ReactMarkdown>
            {promptHelpContent}
          </ReactMarkdown>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PromptHelpButton; 