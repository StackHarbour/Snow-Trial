import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Snow Trail — Know the snow before you go', description: 'Snow-first forecasts for mountains, resorts, cities, and ZIP codes.', metadataBase: new URL('https://snow-trail.example') };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
