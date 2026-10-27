export const LOCALES = ["fa", "en", "ar"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fa";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function localeDir(locale: Locale): "rtl" | "ltr" {
  return locale === "en" ? "ltr" : "rtl";
}

export const LOCALE_META: Record<Locale, { label: string; short: string; og: string }> = {
  fa: { label: "فارسی", short: "فا", og: "fa_IR" },
  en: { label: "English", short: "EN", og: "en_US" },
  ar: { label: "العربية", short: "ع", og: "ar_SA" },
};

// Digits are written in each script's own numerals so stats and years read naturally
export function localizeDigits(value: string | number, locale: Locale): string {
  const text = String(value);
  if (locale === "en") return text;
  const digits = locale === "fa" ? "۰۱۲۳۴۵۶۷۸۹" : "٠١٢٣٤٥٦٧٨٩";
  return text.replace(/\d/g, (d) => digits[Number(d)] ?? d);
}
