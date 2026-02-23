import './globals.css';
import type { Metadata } from 'next';
import { Alegreya, Source_Sans_3 } from 'next/font/google';
import type { ReactNode } from 'react';
import { Providers } from '@/components/providers';

const heading = Alegreya({
  subsets: ['latin'],
  variable: '--font-heading',
});

const body = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Wlacz Wizje - B2B Partner Hub',
  description: 'Secure B2B document sharing platform',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl" className={`${heading.variable} ${body.variable}`}>
      <body className="font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
