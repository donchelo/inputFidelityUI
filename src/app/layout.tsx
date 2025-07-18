import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OpenAI Image Studio - Generate & Edit Images with High Fidelity',
  description: 'A comprehensive UI for generating and editing images using OpenAI\'s GPT Image 1 model with high input fidelity capabilities',
  keywords: ['OpenAI', 'Image Generation', 'Image Editing', 'GPT Image 1', 'High Fidelity', 'AI', 'React', 'Next.js'],
  authors: [{ name: 'OpenAI Image Studio' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3b82f6',
  robots: 'index, follow',
  openGraph: {
    title: 'OpenAI Image Studio',
    description: 'Generate and edit images with high input fidelity using OpenAI\'s GPT Image 1 model',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenAI Image Studio',
    description: 'Generate and edit images with high input fidelity using OpenAI\'s GPT Image 1 model',
  },
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