import { Suspense } from 'react';
import type { Metadata } from 'next';
import {
  Inter,
  Syne,
  Space_Grotesk,
  Sora,
  Archivo,
  Instrument_Sans,
} from 'next/font/google';
import ConnectProvider from '@/provider/ConnectProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
const syne = Syne({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-syne',
});
const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sora',
});
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space_grotesk',
});
const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument_sans',
});
const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-archivo',
});
export const metadata: Metadata = {
  title: 'STRIKE | Blinks on ICP',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} ${sora.variable} ${spaceGrotesk.variable} ${instrumentSans.variable} ${archivo.variable} font-inter`}
    >
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/strike.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-[#FAFAFA]">
        <Suspense>
          <ConnectProvider>{children}</ConnectProvider>
        </Suspense>
      </body>
    </html>
  );
}
