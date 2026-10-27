"use client";

import { motion, type MotionValue, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { useMotionPreference } from "@/components/providers/motion-preference";
import { SectionLabel } from "@/components/ui/section-label";
import { type Dictionary } from "@/i18n";

function Word({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span className="inline-block" style={{ opacity, y }}>
      {word}
    </motion.span>
  );
}

// The statement lights up one word at a time while the section is pinned
export function About({ dict, index }: { dict: Dictionary["about"]; index: string }) {
  const ref = useRef<HTMLElement>(null);
  const { enabled } = useMotionPreference();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const words = dict.statement.split(" ");
  const bodyOpacity = useTransform(scrollYProgress, [0.8, 0.95], [0, 1]);

  return (
    <section
      ref={ref}
      id="about"
      className="relative"
      style={{ height: enabled ? "260vh" : "auto" }}
    >
      <div className="sticky top-0 flex min-h-[100svh] flex-col justify-center gap-10 px-5 py-24 sm:px-10">
        <SectionLabel index={index}>{dict.label}</SectionLabel>
        <p className="font-display max-w-6xl text-[clamp(1.8rem,4.6vw,4.4rem)] leading-[1.12] font-semibold tracking-tight text-balance rtl:leading-[1.5] rtl:tracking-normal">
          {words.map((word, i) =>
            enabled ? (
              <span key={`${word}-${i}`}>
                <Word
                  word={word}
                  progress={scrollYProgress}
                  range={[(i / words.length) * 0.75, ((i + 1) / words.length) * 0.75]}
                />{" "}
              </span>
            ) : (
              <span key={`${word}-${i}`}>{word} </span>
            ),
          )}
        </p>
        <motion.p
          className="text-muted max-w-2xl text-lg leading-relaxed md:ms-auto"
          style={{ opacity: enabled ? bodyOpacity : 1 }}
        >
          {dict.body}
        </motion.p>
      </div>
    </section>
  );
}
