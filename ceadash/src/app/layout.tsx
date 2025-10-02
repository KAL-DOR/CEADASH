import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from '@/lib/auth/context';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CEA Dashboard - Process Mapping Tool",
  description: "ElevenLabs process mapping and scheduling dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <ColorSchemeScript forceColorScheme="light" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <MantineProvider forceColorScheme="light">
          <Notifications />
          <AuthProvider>
            {children}
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}