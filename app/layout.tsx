import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Per Amore della Vita',
  description: 'Restauracja z włoską duszą',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
