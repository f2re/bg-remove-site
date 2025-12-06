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
        <script type="text/javascript">
            (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=105494857', 'ym');

            ym(105494857, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
        </script>
        <noscript><div><img src="https://mc.yandex.ru/watch/105494857" style="position:absolute; left:-9999px;" alt="" /></div></noscript>

        {children}
      </body>
    </html>
  );
}
