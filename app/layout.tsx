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
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", sizes: "any" },
    ],
    apple: "/favicon.svg",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://bg.app-studio.online",
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
  themeColor: "#6366f1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Читаем Metrika ID на сервере (доступен в runtime)
  const metrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || '105494857';

  return (
    <html lang="ru" className="dark scroll-smooth">
      <head>
        <StructuredData />
        {/* Передаем Metrika ID в window для использования на клиенте */}
        {metrikaId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__METRIKA_ID__ = "${metrikaId}";`,
            }}
          />
        )}
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <YandexMetrika />
        {children}
      </body>
    </html>
  );
}
