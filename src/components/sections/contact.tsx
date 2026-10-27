"use client";

import { ArrowUpRight, Copy, Download } from "lucide-react";
import { useState } from "react";

import { Magnetic } from "@/components/ui/magnetic";
import { SectionLabel } from "@/components/ui/section-label";
import { SplitWords } from "@/components/ui/split-words";
import { type Dictionary } from "@/i18n";
import { type Locale } from "@/lib/i18n";
import { SITE, type SocialKey } from "@/lib/site";

import { ContactForm } from "./contact-form";

const SOCIAL_LABELS: Record<SocialKey, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  telegram: "Telegram",
  instagram: "Instagram",
  npm: "npm",
};

export function Contact({
  dict,
  locale,
  resume,
  index,
}: {
  dict: Dictionary["contact"];
  locale: Locale;
  resume: boolean;
  index: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${SITE.email}`;
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden px-5 pt-24 pb-16 sm:px-10 sm:pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute start-1/2 top-0 size-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(212_255_63/0.08),transparent_60%)] rtl:translate-x-1/2"
      />
      <SectionLabel index={index}>{dict.label}</SectionLabel>
      <h2 className="font-display mt-8 text-[clamp(2.8rem,9vw,9rem)] leading-[0.95] font-extrabold tracking-tighter rtl:leading-[1.3] rtl:tracking-normal">
        <SplitWords text={dict.titleTop} className="block" />
        <SplitWords
          text={dict.titleBottom}
          className="block font-serif font-normal italic"
          wordClassName="text-accent"
          delay={0.2}
        />
      </h2>

      <div className="mt-16 grid gap-16 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-8">
          <p className="text-muted max-w-xl text-lg leading-relaxed">{dict.lead}</p>
          <ContactForm dict={dict.form} locale={locale} />
        </div>

        <div className="space-y-8">
          <p className="text-muted font-mono text-xs tracking-[0.2em] uppercase">{dict.direct}</p>
          <div className="space-y-2">
            <a
              href={`mailto:${SITE.email}`}
              dir="ltr"
              data-cursor="hover"
              className="font-display block text-[clamp(1.2rem,2.4vw,2rem)] font-semibold break-all transition-colors hover:text-[var(--accent)] rtl:text-end"
            >
              {SITE.email}
            </a>
            <a
              href={`tel:${SITE.phone}`}
              dir="ltr"
              className="text-muted hover:text-foreground block font-mono transition-colors rtl:text-end"
            >
              {SITE.phone}
            </a>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copyEmail}
              className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-colors hover:bg-white/10"
            >
              <Copy className="size-4" />
              {copied ? dict.copied : dict.copy}
            </button>
            {resume ? (
              <a
                href="/resume.pdf"
                download
                className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-colors hover:bg-white/10"
              >
                <Download className="size-4" />
                {dict.resume}
              </a>
            ) : null}
          </div>
          <ul className="border-t">
            {(Object.keys(SITE.socials) as SocialKey[]).map((key) => (
              <li key={key} className="border-b">
                <Magnetic strength={0.08} className="block w-full">
                  <a
                    href={SITE.socials[key]}
                    target="_blank"
                    rel="noopener me"
                    data-cursor="hover"
                    className="group flex items-center justify-between py-4 text-lg transition-colors hover:text-[var(--accent)]"
                  >
                    <span className="transition-transform duration-500 group-hover:translate-x-2 rtl:group-hover:-translate-x-2">
                      {SOCIAL_LABELS[key]}
                    </span>
                    <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:rotate-45 rtl:-scale-x-100" />
                  </a>
                </Magnetic>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
