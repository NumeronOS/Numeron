import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Providers } from './providers';

import './css/index.css';
import './css/game-img.css';
import 'tailwindcss/tailwind.css';

export const metadata: Metadata = {
  title: 'Monster Hunter',
  description: 'Monster Hunter',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
