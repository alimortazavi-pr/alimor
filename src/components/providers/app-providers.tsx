"use client";

import { type PropsWithChildren } from "react";

import { MotionPreferenceProvider } from "./motion-preference";
import { SmoothScroll } from "./smooth-scroll";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <MotionPreferenceProvider>
      <SmoothScroll>{children}</SmoothScroll>
    </MotionPreferenceProvider>
  );
}
