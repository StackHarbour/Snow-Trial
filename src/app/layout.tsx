import type { Metadata } from "next";
import "@/app/globals.css";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = { title: "Snow Trail | Clearer snow forecasts", description: "Snow-first forecast discovery. Demo data only in this prototype." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><Navigation /><main>{children}</main><Footer /></body></html>; }
