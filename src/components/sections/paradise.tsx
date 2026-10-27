"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

import { SectionLabel } from "@/components/ui/section-label";
import { Spotlight } from "@/components/ui/spotlight";
import { type Dictionary } from "@/i18n";
import { SITE } from "@/lib/site";

export function Paradise({ dict, index }: { dict: Dictionary["paradise"]; index: string }) {
  return (
    <section id="paradise" className="px-5 py-24 sm:px-10">
      <motion.a
        href={SITE.paradise}
        target="_blank"
        rel="noopener"
        data-cursor="hover"
        className="conic-border group block rounded-[2.5rem]"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <Spotlight className="relative grid gap-10 overflow-hidden rounded-[2.5rem] p-8 sm:p-14 md:grid-cols-[1fr_auto] md:items-end">
          <div
            aria-hidden
            className="pointer-events-none absolute start-1/3 -top-1/2 size-[40rem] rounded-full bg-[radial-gradient(circle,rgb(123_92_255/0.25),transparent_65%)] blur-2xl transition-transform duration-1000 group-hover:scale-125"
          />
          <div className="relative space-y-6">
            <SectionLabel index={index}>{dict.label}</SectionLabel>
            <h2
              dir="ltr"
              className="font-display text-[clamp(3rem,10vw,9rem)] leading-[0.9] font-extrabold tracking-tighter rtl:text-end"
            >
              Paradise<span className="text-accent">/</span>Code
            </h2>
            <p className="text-muted max-w-2xl text-lg leading-relaxed">{dict.body}</p>
          </div>
          <span className="relative inline-flex items-center gap-3 self-end font-medium whitespace-nowrap">
            {dict.cta}
            <span className="bg-accent text-accent-foreground grid size-14 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-45 rtl:-scale-x-100">
              <ArrowUpRight className="size-6" />
            </span>
          </span>
        </Spotlight>
      </motion.a>
    </section>
  );
}
