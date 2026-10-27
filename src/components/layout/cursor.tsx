"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

import { useMotionPreference } from "@/components/providers/motion-preference";

// A dot that tracks the pointer exactly and a ring that trails it; the ring swells over links
export function Cursor() {
  const { enabled } = useMotionPreference();
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.5 });

  useEffect(() => {
    if (!enabled || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setActive(true);
      const target = event.target instanceof Element ? event.target : null;
      setHovering(Boolean(target?.closest("a, button, [data-cursor='hover'], input, textarea")));
    };
    const onLeave = () => setActive(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.classList.add("has-cursor");
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] hidden mix-blend-difference [@media(pointer:fine)]:block"
    >
      <motion.div
        className="absolute top-0 left-0 size-1.5 rounded-full bg-white"
        style={{ x, y, translateX: "-50%", translateY: "-50%", opacity: active ? 1 : 0 }}
      />
      <motion.div
        className="absolute top-0 left-0 rounded-full border border-white"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: hovering ? 64 : 34,
          height: hovering ? 64 : 34,
          opacity: active ? 1 : 0,
          backgroundColor: hovering ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)",
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
