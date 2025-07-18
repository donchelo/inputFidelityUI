// AI4U Typography System
// Usando fuentes locales: Red_Hat_Display y CLT Necto Mono

export const ai4uTypography = {
    // Fuentes principales - usando tu Red_Hat_Display local
    fontFamily: [
      'Red_Hat_Display', // Tu fuente local
      'Red Hat Display', // Fallback
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
  
    // Fuente para código y números - usando tu CLT Necto Mono local
    fontFamilyMono: [
      'CLT Necto Mono', // Tu fuente local
      'Necto Mono', // Fallback
      'Monaco',
      'Consolas',
      '"Liberation Mono"',
      'monospace',
    ].join(','),
  
    // Jerarquía tipográfica AI4U
    h1: {
      fontFamily: 'Red_Hat_Display, sans-serif',
      fontWeight: 900, // RHD Black
      fontSize: '3.5rem',
      lineHeight: 1.2,
      letterSpacing: '0.02em',
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
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
  
    h6: {
      fontFamily: 'Red_Hat_Display, sans-serif',
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.5,
      '@media (max-width:600px)': {
        fontSize: '1.125rem',
      },
    },
  
    // Texto de cuerpo
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
  
    overline: {
      fontFamily: 'Red_Hat_Display, sans-serif',
      fontWeight: 600, // RHD Semibold
      fontSize: '0.75rem',
      lineHeight: 2.66,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
    },
  
    button: {
      fontFamily: 'Red_Hat_Display, sans-serif',
      fontWeight: 500, // RHD Medium
      fontSize: '0.875rem',
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'none',
    },
  
    // Números y código usando tu CLT Necto Mono
    code: {
      fontFamily: 'CLT Necto Mono, monospace',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.4,
      letterSpacing: '0.02em',
    },
  
    // Elementos especiales AI4U
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
  
    tagline: {
      fontFamily: 'Red_Hat_Display, sans-serif',
      fontWeight: 300, // RHD Light
      fontSize: '1.125rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
      fontStyle: 'italic',
    },
  };
  
  export default ai4uTypography;