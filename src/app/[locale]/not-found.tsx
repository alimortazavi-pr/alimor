import { locale as localeParam } from "next/root-params";

import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

export default async function NotFound() {
  // not-found receives no params; the root segment is still readable through root-params
  const value = await localeParam();
  const locale = value && isLocale(value) ? value : DEFAULT_LOCALE;
  const dict = getDictionary(locale).notFound;

  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden px-6 text-center">
      <p
        aria-hidden
        className="text-outline font-display pointer-events-none absolute [font-family:var(--font-bricolage)] text-[40vw] leading-none font-extrabold"
      >
        404
      </p>
      <div className="relative space-y-6">
        <h1 className="font-display text-4xl font-bold sm:text-6xl">{dict.title}</h1>
        <p className="text-muted text-lg">{dict.body}</p>
        <a
          href={`/${locale}`}
          className="bg-accent text-accent-foreground inline-block rounded-full px-7 py-3 font-semibold"
        >
          {dict.home}
        </a>
      </div>
    </main>
  );
}
