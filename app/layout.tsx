import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata={title:"Snow Trail — Know the snow before you go",description:"Snow-first forecasts for mountains, resorts, cities, and ZIP codes."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
