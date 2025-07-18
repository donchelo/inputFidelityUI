import { createTheme } from '@mui/material/styles';
import { ai4uPalette } from './palette';

// Tipografía basada en el brand book (Red Hat Display + CLT Necto Mono)
const typography = {
  // Fuente principal usando tu Red_Hat_Display local
  fontFamily: [
    'Red_Hat_Display',
    'Red Hat Display',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),

  // Fuente mono usando tu CLT Necto Mono local
  fontFamilyMono: [
    'CLT Necto Mono',
    'Necto Mono',
    'Monaco',
    'Consolas',
    '"Liberation Mono"',
    'monospace',
  ].join(','),

  h1: {
    fontFamily: 'Red_Hat_Display, sans-serif',
    fontWeight: 900, // RHD Black para títulos principales
    fontSize: '3.5rem',
    lineHeight: 1.2,
    letterSpacing: '0.02em', // Corregido: 20px era demasiado
    '@media (max-width:600px)': {
      fontSize: '2.5rem',
    },
  },
  h2: {
    fontFamily: 'Red_Hat_Display, sans-serif',
    fontWeight: 700, // RHD Bold
    fontSize: '2.75rem',
    lineHeight: 1.3,
    letterSpacing: '0.01em',
    '@media (max-width:600px)': {
      fontSize: '2rem',
    },
  },
  h3: {
    fontFamily: 'Red_Hat_Display, sans-serif',
    fontWeight: 600, // RHD Semibold
    fontSize: '2.25rem',
    lineHeight: 1.4,
    '@media (max-width:600px)': {
      fontSize: '1.75rem',
    },
  },
  h4: {
    fontFamily: 'Red_Hat_Display, sans-serif',
    fontWeight: 500, // RHD Medium
    fontSize: '1.75rem',
    lineHeight: 1.4,
    '@media (max-width:600px)': {
      fontSize: '1.5rem',
    },
  },
  h5: {
    fontFamily: 'Red_Hat_Display, sans-serif',
    fontWeight: 500,
    fontSize: '1.5rem',
    lineHeight: 1.5,
  },
  h6: {
    fontFamily: 'Red_Hat_Display, sans-serif',
    fontWeight: 500,
    fontSize: '1.25rem',
    lineHeight: 1.5,
  },
  body1: {
    fontFamily: 'Red_Hat_Display, sans-serif',
    fontWeight: 400, // RHD Regular
    fontSize: '1rem',
    lineHeight: 1.6,
    letterSpacing: '0.00938em',
  },
  body2: {
    fontFamily: 'Red_Hat_Display, sans-serif',
    fontWeight: 400,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    letterSpacing: '0.01071em',
  },
  caption: {
    fontFamily: 'Red_Hat_Display, sans-serif',
    fontWeight: 300, // RHD Light
    fontSize: '0.75rem',
    lineHeight: 1.4,
    letterSpacing: '0.03333em',
  },
  button: {
    fontFamily: 'Red_Hat_Display, sans-serif',
    fontWeight: 500, // RHD Medium
    fontSize: '0.875rem',
    lineHeight: 1.75,
    letterSpacing: '0.02857em',
    textTransform: 'none',
  },
  // Para números y caracteres especiales - usando tu CLT Necto Mono
  code: {
    fontFamily: 'CLT Necto Mono, monospace',
    fontWeight: 400,
    fontSize: '0.875rem',
    lineHeight: 1.4,
    letterSpacing: '0.02em',
  },
  // Elemento especial para títulos hero
  display: {
    fontFamily: 'Red_Hat_Display, sans-serif',
    fontWeight: 900, // RHD Black
    fontSize: '4rem',
    lineHeight: 1.1,
    letterSpacing: '0.02em',
    '@media (max-width:600px)': {
      fontSize: '3rem',
    },
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
          fontFamily: 'Red_Hat_Display, sans-serif',
          textTransform: 'none', // Sin transformación de texto
          borderRadius: 24, // Botones más redondeados como en el brand book
          fontWeight: 500,
          letterSpacing: '0.02em',
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
    MuiTypography: {
      styleOverrides: {
        // Estilo especial para código y números
        code: {
          fontFamily: 'CLT Necto Mono, monospace',
          backgroundColor: 'rgba(255, 110, 0, 0.1)', // Usando color de marca
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '0.875em',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            fontFamily: 'Red_Hat_Display, sans-serif',
          },
        },
      },
    },
  },
});

export default ai4uTheme;