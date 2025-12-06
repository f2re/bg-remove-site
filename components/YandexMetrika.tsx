"use client";

import Script from "next/script";

export default function YandexMetrika() {
  const METRIKA_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;

  // Не рендерим Метрику, если ID не указан
  if (!METRIKA_ID) {
    console.warn("⚠️  NEXT_PUBLIC_YANDEX_METRIKA_ID не указан в .env - Yandex Metrika отключена");
    return null;
  }

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

          ym(${METRIKA_ID}, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true
          });
        `}
      </Script>
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${METRIKA_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}

// Функция для отправки целей
export function reachGoal(goal: string) {
  const METRIKA_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;

  if (!METRIKA_ID) {
    console.warn(`⚠️  Metrika goal "${goal}" не отправлена - NEXT_PUBLIC_YANDEX_METRIKA_ID не указан`);
    return;
  }

  if (typeof window !== "undefined" && window.ym) {
    window.ym(METRIKA_ID, "reachGoal", goal);
    console.log(`✅ Metrika goal отправлена: ${goal}`);
  }
}

// Типизация для window.ym
declare global {
  interface Window {
    ym: (id: string, method: string, ...args: any[]) => void;
  }
}
