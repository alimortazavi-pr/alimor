"use client";

import Lenis from "lenis";
import { type PropsWithChildren, useEffect } from "react";

import { useMotionPreference } from "./motion-preference";

let lenis: Lenis | null = null;

export function scrollToTarget(target: string | HTMLElement | number) {
  if (lenis) lenis.scrollTo(target, { offset: -24, duration: 1.4 });
  else if (typeof target === "number") window.scrollTo({ top: target });
  else (typeof target === "string" ? document.querySelector(target) : target)?.scrollIntoView();
}

// Lenis moves the page with its own rAF loop; motion's useScroll reads native scroll, so both stay in sync
export function SmoothScroll({ children }: PropsWithChildren) {
  const { enabled } = useMotionPreference();

  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? "on" : "off";
    if (!enabled) return;
    const instance = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      autoRaf: true,
    });
    lenis = instance;
    return () => {
      instance.destroy();
      lenis = null;
    };
  }, [enabled]);

  return children;
}
