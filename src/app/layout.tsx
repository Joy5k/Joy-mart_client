import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "../providers/redux-provider";
import { ToastContainer } from "react-toastify";
import NextNProgress from 'nextjs-progressbar';
import NextProgress from "../components/NextProgress/PageProgressBar";
import PageProgressBar from "../components/NextProgress/PageProgressBar";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home",
  description: "home page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                suppressHydrationWarning

      >
        <Suspense fallback={<div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#088178]"></div>
        </div>}>
          
                 <PageProgressBar />
    </Suspense>

       <ReduxProvider>
        
          {children}

                  <ToastContainer />

        </ReduxProvider>
      </body>
    </html>
  );
}
