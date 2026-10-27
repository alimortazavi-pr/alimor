"use client";

import { useSyncExternalStore } from "react";

import { type Locale } from "@/lib/i18n";

const INTL_LOCALE: Record<Locale, string> = { fa: "fa-IR", en: "en-GB", ar: "ar-EG" };

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 1000);
  return () => window.clearInterval(id);
}

// Ali's wall clock, so a visitor abroad knows whether a reply will come now or tomorrow
export function LocalClock({ locale }: { locale: Locale }) {
  const time = useSyncExternalStore(
    subscribe,
    () =>
      new Intl.DateTimeFormat(INTL_LOCALE[locale], {
        timeZone: "Asia/Tehran",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date()),
    () => "--:--:--",
  );
  return (
    <time className="tabular-nums" suppressHydrationWarning>
      {time}
    </time>
  );
}
