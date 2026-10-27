"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { useMotionPreference } from "@/components/providers/motion-preference";

export function RoleRotator({ roles }: { roles: string[] }) {
  const { enabled } = useMotionPreference();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % roles.length), 2600);
    return () => window.clearInterval(id);
  }, [enabled, roles.length]);

  return (
    <span className="relative inline-grid overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={index}
          className="text-accent col-start-1 row-start-1 whitespace-nowrap"
          initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
