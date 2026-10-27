"use client";

import { Gauge, Layers, PenTool, Server } from "lucide-react";
import { motion } from "motion/react";

import { SectionLabel } from "@/components/ui/section-label";
import { SplitWords } from "@/components/ui/split-words";
import { Spotlight } from "@/components/ui/spotlight";
import { type Dictionary } from "@/i18n";
import { SITE } from "@/lib/site";

const ICONS = [Layers, Gauge, PenTool, Server];

function Marquee({ items, reverse = false }: { items: readonly string[]; reverse?: boolean }) {
  return (
    <div
      className="group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
      dir="ltr"
    >
      <div
        className={`flex w-max shrink-0 gap-3 pe-3 group-hover:[animation-play-state:paused] ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={`${item}-${i}`}
            aria-hidden={i >= items.length}
            className="font-display flex items-center gap-3 rounded-full border px-6 py-3 text-xl font-semibold whitespace-nowrap sm:text-3xl"
          >
            <span className="bg-accent size-1.5 rounded-full" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Craft({ dict, index }: { dict: Dictionary["craft"]; index: string }) {
  const half = Math.ceil(SITE.stack.length / 2);

  return (
    <section id="craft" className="space-y-16 py-24 sm:py-32">
      <div className="grid gap-8 px-5 sm:px-10 md:grid-cols-2 md:items-end">
        <div className="space-y-5">
          <SectionLabel index={index}>{dict.label}</SectionLabel>
          <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.02] font-bold tracking-tight rtl:leading-[1.35] rtl:tracking-normal">
            <SplitWords text={dict.title} />
          </h2>
        </div>
        <p className="text-muted max-w-md text-lg leading-relaxed md:ms-auto">{dict.lead}</p>
      </div>

      <div className="grid gap-3 px-5 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
        {dict.items.map((item, i) => {
          const Icon = ICONS[i] ?? Layers;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <Spotlight className="bg-surface group flex h-full min-h-72 flex-col justify-between gap-10 rounded-3xl border p-7">
                <span className="grid size-12 place-items-center rounded-2xl border transition-colors duration-500 group-hover:border-transparent group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-foreground)]">
                  <Icon className="size-5" />
                </span>
                <div className="space-y-3">
                  <h3 className="font-display text-2xl font-semibold tracking-tight rtl:tracking-normal">
                    {item.title}
                  </h3>
                  <p className="text-muted leading-relaxed">{item.body}</p>
                </div>
              </Spotlight>
            </motion.div>
          );
        })}
      </div>

      <div className="space-y-3">
        <p className="text-muted px-5 font-mono text-xs tracking-[0.2em] uppercase sm:px-10">
          {dict.stackLabel}
        </p>
        <Marquee items={SITE.stack.slice(0, half)} />
        <Marquee items={SITE.stack.slice(half)} reverse />
      </div>
    </section>
  );
}
