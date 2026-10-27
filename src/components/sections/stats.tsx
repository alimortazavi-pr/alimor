"use client";

import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef } from "react";

import { SectionLabel } from "@/components/ui/section-label";
import { Spotlight } from "@/components/ui/spotlight";
import { type Dictionary } from "@/i18n";
import { type Locale, localizeDigits } from "@/lib/i18n";

function Counter({ value, suffix, locale }: { value: number; suffix: string; locale: Locale }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  useEffect(() => {
    const el = ref.current;
    if (!inView || !el) return;
    const controls = animate(0, value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        el.textContent = localizeDigits(Math.round(latest), locale) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, locale]);

  // Server HTML carries the final number, so crawlers and no-JS readers see the real value
  return (
    <span ref={ref} className="tabular-nums">
      {localizeDigits(value, locale)}
      {suffix}
    </span>
  );
}

const SPANS = ["md:col-span-2 md:row-span-2", "", "", "md:col-span-2"];

export function Stats({
  dict,
  locale,
  index,
}: {
  dict: Dictionary["stats"];
  locale: Locale;
  index: string;
}) {
  return (
    <section className="px-5 py-24 sm:px-10 sm:py-32">
      <SectionLabel index={index} className="mb-10">
        {dict.label}
      </SectionLabel>
      <div className="grid auto-rows-[minmax(11rem,auto)] grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
        {dict.items.map((item, i) => (
          <motion.div
            key={item.label}
            className={SPANS[i]}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <Spotlight className="bg-surface group flex h-full flex-col justify-between overflow-hidden rounded-3xl border p-7">
              <span className="text-faint font-mono text-xs">
                {localizeDigits(`0${i + 1}`, locale)}
              </span>
              <div>
                <p
                  className={
                    i === 0
                      ? "font-display text-accent text-[clamp(5rem,13vw,11rem)] leading-none font-extrabold tracking-tighter"
                      : "font-display text-[clamp(3rem,6vw,5rem)] leading-none font-bold tracking-tighter"
                  }
                >
                  <Counter value={item.value} suffix={item.suffix} locale={locale} />
                </p>
                <p className="text-muted mt-3 max-w-[18rem] text-sm sm:text-base">{item.label}</p>
              </div>
            </Spotlight>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
