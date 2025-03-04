import { type Metadata } from "next";
import { type PropsWithChildren } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactQueryProvider } from "@srms/components/providers/ReactQueryProvider";
import { ThemeProvider } from "@srms/components/providers/ThemeProvider";
import { ReactScan } from "@srms/components/features/ReactScan";
import "@srms/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SRMS",
};

export default async function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ReactScan />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReactQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <main className="h-screen w-screen overflow-x-hidden">{children}</main>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
