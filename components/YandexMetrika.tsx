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
