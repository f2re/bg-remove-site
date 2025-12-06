"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function YandexMetrika() {
  const [metrikaId, setMetrikaId] = useState<string>("");

  useEffect(() => {
    // Читаем ID из window (установлен в layout.tsx на сервере)
    const id = (window as any).__METRIKA_ID__ || "";
    setMetrikaId(id);

    if (!id) {
      console.warn("⚠️  NEXT_PUBLIC_YANDEX_METRIKA_ID не указан в .env - Yandex Metrika отключена");
    }
  }, []);

  // Не рендерим Метрику, если ID не указан
  if (!metrikaId) {
    return null;
  }

  return (
    <>
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=105494857", "ym");

            ym(${metrikaId}, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true
            });
          `
        }}
      />
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${metrikaId}`}
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
  if (typeof window === "undefined") return;

  const METRIKA_ID = (window as any).__METRIKA_ID__;

  if (!METRIKA_ID) {
    console.warn(`⚠️  Metrika goal "${goal}" не отправлена - NEXT_PUBLIC_YANDEX_METRIKA_ID не указан`);
    return;
  }

  if (window.ym) {
    window.ym(METRIKA_ID, "reachGoal", goal);
    console.log(`✅ Metrika goal отправлена: ${goal}`);
  }
}

// Типизация для window
declare global {
  interface Window {
    ym: (id: string, method: string, ...args: any[]) => void;
    __METRIKA_ID__?: string;
  }
}
