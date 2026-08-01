import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "NimbleFlow",
  description:
    "Готовый каркас сайта на Next.js с авторизацией, личным кабинетом и приёмом оплаты.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
