import type { Metadata } from "next";
import Script from 'next/script'
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

import { cn } from "../lib/utils"

/*
 Components
*/
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import Sidebar from '@/components/Sidebar';

// const inter = Inter({ subsets: ["latin"] });

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "ARSB",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-montserrat antialiased bg-white",
          fontSans.variable
        )}
      >
        <SidebarProvider>
          <AppSidebar />
          <SidebarTrigger />
          <div>
            {children}
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
