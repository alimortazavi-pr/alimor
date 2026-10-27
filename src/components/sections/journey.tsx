"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { useMotionPreference } from "@/components/providers/motion-preference";
import { SectionLabel } from "@/components/ui/section-label";
import { type Dictionary } from "@/i18n";
import { type Locale, localizeDigits } from "@/lib/i18n";

type Item = Dictionary["journey"]["items"][number];

function Card({ item, i, locale }: { item: Item; i: number; locale: Locale }) {
  return (
    <article className="bg-surface relative flex h-[min(68svh,34rem)] w-[min(86vw,32rem)] shrink-0 flex-col justify-between overflow-hidden rounded-[2rem] border p-8 sm:p-10">
      <span
        aria-hidden
        className="text-outline font-display pointer-events-none absolute -end-4 -top-6 text-[9rem] leading-none font-extrabold tracking-tighter sm:text-[12rem]"
      >
        {localizeDigits(item.year, locale)}
      </span>
      <span className="text-accent font-mono text-sm">{localizeDigits(`0${i + 1}`, locale)}</span>
      <div className="relative space-y-4">
        <p className="text-muted font-mono text-xs tracking-widest uppercase">
          {localizeDigits(item.year, locale)} · {item.role}
        </p>
        <h3 className="font-display text-3xl font-bold tracking-tight sm:text-4xl rtl:tracking-normal">
          {item.title}
        </h3>
        <p className="text-muted leading-relaxed">{item.body}</p>
      </div>
    </article>
  );
}

// Vertical scroll drives a horizontal track while the section is pinned
export function Journey({
  dict,
  locale,
  index,
}: {
  dict: Dictionary["journey"];
  locale: Locale;
  index: string;
}) {
  const { enabled } = useMotionPreference();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const direction = locale === "en" ? -1 : 1;
  const x = useTransform(smooth, (v) => v * distance * direction);
  const bar = useTransform(smooth, [0, 1], [0, 1]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !enabled) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [enabled]);

  const header = (
    <div className="flex flex-wrap items-end justify-between gap-6 px-5 sm:px-10">
      <div className="space-y-5">
        <SectionLabel index={index}>{dict.label}</SectionLabel>
        <h2 className="font-display max-w-3xl text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.02] font-bold tracking-tight text-balance rtl:leading-[1.35] rtl:tracking-normal">
          {dict.title}
        </h2>
      </div>
      <p className="text-muted font-serif text-lg italic">{dict.hint}</p>
    </div>
  );

  if (!enabled) {
    return (
      <section id="journey" className="space-y-12 py-24">
        {header}
        <div className="flex gap-4 overflow-x-auto px-5 pb-4 sm:px-10">
          {dict.items.map((item, i) => (
            <Card key={item.year} item={item} i={i} locale={locale} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative"
      style={{ height: `${dict.items.length * 85}vh` }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center gap-10 overflow-hidden">
        {header}
        <motion.div
          ref={trackRef}
          className="flex w-max gap-4 px-5 sm:gap-6 sm:px-10"
          style={{ x }}
        >
          {dict.items.map((item, i) => (
            <Card key={item.year} item={item} i={i} locale={locale} />
          ))}
        </motion.div>
        <div className="bg-line mx-5 h-px sm:mx-10">
          <motion.div
            className="bg-accent h-full origin-left rtl:origin-right"
            style={{ scaleX: bar }}
          />
        </div>
      </div>
    </section>
  );
}
