"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/cn";

interface SplitWordsProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  // Reveal on mount (hero) instead of when scrolled into view
  immediate?: boolean;
}

// Words, never letters: Persian and Arabic letters join, so splitting them breaks the script
export function SplitWords({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
  immediate = false,
}: SplitWordsProps) {
  const words = text.split(" ");
  const trigger = immediate
    ? { animate: "shown" as const }
    : { whileInView: "shown" as const, viewport: { once: true, margin: "0px 0px -12% 0px" } };

  return (
    <motion.span className={cn("inline", className)} initial="hidden" {...trigger}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden pb-[0.12em] align-bottom"
        >
          <motion.span
            className={cn("inline-block will-change-transform", wordClassName)}
            variants={{
              hidden: { y: "110%", rotate: 4, opacity: 0 },
              shown: {
                y: "0%",
                rotate: 0,
                opacity: 1,
                transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: delay + i * stagger },
              },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </motion.span>
  );
}
