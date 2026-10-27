"use client";

import { ArrowDownRight, Download } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { scrollToTarget } from "@/components/providers/smooth-scroll";
import { Magnetic } from "@/components/ui/magnetic";
import { SplitWords } from "@/components/ui/split-words";
import { type Dictionary } from "@/i18n";
import { type Locale } from "@/lib/i18n";

import { AuraCanvas } from "./aura-canvas";
import { LocalClock } from "./local-clock";
import { RoleRotator } from "./role-rotator";

interface HeroProps {
  locale: Locale;
  dict: Dictionary["hero"];
  resume: boolean;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({ locale, dict, resume }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const nameScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.8], ["blur(0px)", "blur(14px)"]);
  const rtl = locale !== "en";

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-5 pt-28 pb-8 sm:px-10"
    >
      <AuraCanvas />

      <motion.div
        className="text-foreground/70 relative z-10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs tracking-wider uppercase"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9, ease: EASE }}
      >
        <span className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 normal-case">
          <span className="bg-accent size-2 animate-[pulse-dot_1.8s_ease-out_infinite] rounded-full" />
          {dict.status}
        </span>
        <span className="flex items-center gap-3">
          <span className="text-muted">{dict.localTime}</span>
          <LocalClock locale={locale} />
          <span className="text-faint">·</span>
          <span>{dict.location}</span>
        </span>
      </motion.div>

      <motion.h1
        className="font-display relative z-10 mt-auto mb-10 leading-[0.82] font-extrabold tracking-[-0.045em] select-none rtl:leading-[1.05] rtl:tracking-normal"
        style={{
          y: nameY,
          scale: nameScale,
          opacity: fade,
          filter: blur,
          transformOrigin: rtl ? "right bottom" : "left bottom",
        }}
      >
        <span className="sr-only">
          {dict.firstName} {dict.lastName}
        </span>
        <span aria-hidden className="block text-[clamp(4rem,min(26vw,25svh),19rem)]">
          <SplitWords text={dict.firstName} immediate delay={0.25} />
        </span>
        <span aria-hidden className="block text-[clamp(2.8rem,min(16vw,18svh),14rem)]">
          <SplitWords
            text={dict.lastName}
            immediate
            delay={0.4}
            wordClassName="bg-gradient-to-br from-foreground via-foreground to-foreground/30 bg-clip-text text-transparent"
          />
          <motion.span
            className="text-accent inline-block"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 1.05, ease: EASE }}
          >
            .
          </motion.span>
        </span>
      </motion.h1>

      <motion.div className="relative z-10" style={{ opacity: fade }}>
        <motion.div
          className="grid gap-8 border-t pt-7 md:grid-cols-[1.1fr_1fr] md:items-end"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1.1, ease: EASE }}
        >
          <div className="space-y-4">
            <p className="text-xl font-medium sm:text-2xl">
              <span className="text-muted">{dict.rolePrefix} </span>
              <RoleRotator roles={dict.roles} />
            </p>
            <p className="text-muted max-w-xl text-base leading-relaxed text-pretty sm:text-lg">
              {dict.lead}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <Magnetic>
              <a
                href="#contact"
                data-cursor="hover"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToTarget("#contact");
                }}
                className="bg-accent text-accent-foreground group inline-flex items-center gap-3 rounded-full py-3 ps-6 pe-3 font-semibold transition-transform active:scale-95"
              >
                {dict.primary}
                <span className="bg-accent-foreground text-accent grid size-9 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-45 rtl:-scale-x-100">
                  <ArrowDownRight className="size-4" />
                </span>
              </a>
            </Magnetic>
            {resume ? (
              <Magnetic>
                <a
                  href="/resume.pdf"
                  download
                  data-cursor="hover"
                  className="glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-medium transition-colors hover:bg-white/10"
                >
                  <Download className="size-4" />
                  {dict.secondary}
                </a>
              </Magnetic>
            ) : null}
          </div>
        </motion.div>
      </motion.div>

      <motion.button
        type="button"
        onClick={() => scrollToTarget("#about")}
        className="text-muted relative z-10 mx-auto mt-8 flex flex-col items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase"
        style={{ opacity: fade }}
        aria-label={dict.scroll}
      >
        {dict.scroll}
        <span className="bg-line relative h-10 w-px overflow-hidden">
          <motion.span
            className="bg-accent absolute inset-x-0 top-0 h-1/2"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.button>
    </section>
  );
}
