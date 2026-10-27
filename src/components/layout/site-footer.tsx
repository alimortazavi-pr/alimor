"use client";

import { ArrowUp } from "lucide-react";

import { scrollToTarget } from "@/components/providers/smooth-scroll";
import { type Dictionary } from "@/i18n";
import { type Locale, localizeDigits } from "@/lib/i18n";

export function SiteFooter({
  dict,
  locale,
  brand,
}: {
  dict: Dictionary["footer"];
  locale: Locale;
  brand: string;
}) {
  return (
    <footer className="relative overflow-hidden border-t px-5 pt-10 pb-6 sm:px-10">
      <div className="text-muted flex flex-wrap items-center justify-between gap-4 text-sm">
        <p>
          © {localizeDigits(new Date().getFullYear(), locale)} {brand}. {dict.rights}
        </p>
        <p className="font-serif italic">{dict.built}</p>
        <button
          type="button"
          onClick={() => scrollToTarget(0)}
          className="hover:text-foreground inline-flex items-center gap-2 transition-colors"
        >
          {dict.top}
          <ArrowUp className="size-4" />
        </button>
      </div>
      <p
        aria-hidden
        dir="ltr"
        className="font-display text-outline mt-8 text-center [font-family:var(--font-bricolage)] text-[clamp(2.5rem,11vw,14rem)] leading-[0.8] font-extrabold tracking-tighter whitespace-nowrap select-none"
      >
        ALI MORTAZAVI
      </p>
    </footer>
  );
}
