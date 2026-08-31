import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { TopNav } from '@/components/navigation/TopNav';
import { Footer } from '@/components/navigation/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: 'Snow Trail | Snow-First Weather Forecasting',
  description: 'Understand exactly when, where, and how much snow will fall.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable}`}>
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <TopNav />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}