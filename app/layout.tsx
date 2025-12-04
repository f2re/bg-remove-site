import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/StructuredData";
import YandexMetrika from "@/components/YandexMetrika";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Удаление фона с фото онлайн через Telegram бот | BG Remove",
  description:
    "Удалите фон с любой фотографии за 5 секунд через Telegram бот. Нейросеть создает прозрачный или белый фон. Первые 3 фото бесплатно. Для маркетплейсов, документов, соцсетей.",
  keywords:
    "удаление фона, убрать фон с фото, прозрачный фон, telegram бот, обработка фото, нейросеть, белый фон, маркетплейсы, ozon, wildberries",
  authors: [{ name: "BG Remove" }],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://yourdomain.com",
    title: "BG Remove - Удаление фона через Telegram",
    description: "Первые 3 фото бесплатно! Нейросеть удаляет фон за 5 секунд",
    siteName: "BG Remove",
  },
  twitter: {
    card: "summary_large_image",
    title: "BG Remove - Удаление фона",
    description: "Первые 3 фото бесплатно! Нейросеть удаляет фон за 5 секунд",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="scroll-smooth">
      <head>
        <StructuredData />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <YandexMetrika />
        {children}
      </body>
    </html>
  );
}
