import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Geist_Mono, Quicksand } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
// import { AuthProvider } from '@/components/auth/AuthProvider';

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Live With Quran Admin',
  description: 'Live With Quran Admin',
  icons: {
    icon: '/IshmaalQuran-Logo.png',
    apple: '/IshmaalQuran-Logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} ${geistMono.variable} antialiased`}>
        <TooltipProvider>
          {/* <AuthProvider> */}
            {children}
            {/* </AuthProvider> */}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}