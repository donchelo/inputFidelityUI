import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GPT Image-1 Editor - High Input Fidelity Image Editing',
  description: 'Edit images with high input fidelity using OpenAI\'s GPT Image-1 model. Preserve faces, logos, and fine details.',
  keywords: ['OpenAI', 'Image Editing', 'GPT Image-1', 'High Fidelity', 'AI', 'React', 'Next.js'],
  authors: [{ name: 'GPT Image-1 Editor' }],
  robots: 'index, follow',
  openGraph: {
    title: 'GPT Image-1 Editor',
    description: 'Edit images with high input fidelity using OpenAI\'s GPT Image-1 model',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GPT Image-1 Editor',
    description: 'Edit images with high input fidelity using OpenAI\'s GPT Image-1 model',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full antialiased`}>
        {children}
      </body>
    </html>
  );
}