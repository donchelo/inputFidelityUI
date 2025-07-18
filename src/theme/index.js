import { createTheme } from '@mui/material/styles';
import { ai4uPalette } from './palette';

// Tipografía basada en el brand book (Red Hat Display + Necto Mono)
const typography = {
  fontFamily: [
    'Red Hat Display',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  h1: {
    fontFamily: 'Red Hat Display',
    fontWeight: 700, // RHD Bold
    letterSpacing: '20px', // Según brand book
  },
  h2: {
    fontFamily: 'Red Hat Display',
    fontWeight: 600, // RHD Semibold
  },
  h3: {
    fontFamily: 'Red Hat Display',
    fontWeight: 500, // RHD Regular
  },
  h4: {
    fontFamily: 'Red Hat Display',
    fontWeight: 400, // RHD Light
  },
  body1: {
    fontFamily: 'Red Hat Display',
    fontWeight: 400,
  },
  code: {
    fontFamily: 'Necto Mono, monospace', // Para números y caracteres especiales
  },
};

export const ai4uTheme = createTheme({
  palette: ai4uPalette,
  typography,
  shape: {
    borderRadius: 8, // Bordes suaves para mantener el estilo moderno
  },
  components: {
    // Personalizaciones específicas de componentes
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Sin transformación de texto
          borderRadius: 24, // Botones más redondeados como en el brand book
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 8px rgba(255, 110, 0, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)',
        },
      },
    },
  },
});

export default ai4uTheme; 