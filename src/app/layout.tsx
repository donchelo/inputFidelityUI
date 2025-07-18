"use client";
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ai4uTheme from '../theme';
import '../styles/fonts.css';
import PromptHelpButton from '../components/PromptHelpButton';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={ai4uTheme}>
          <CssBaseline />
          {children}
          <PromptHelpButton />
        </ThemeProvider>
      </body>
    </html>
  );
}