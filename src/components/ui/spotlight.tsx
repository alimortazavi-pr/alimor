"use client";

import { type HTMLAttributes, type PointerEvent } from "react";

import { cn } from "@/lib/cn";

// Writes the cursor position into CSS variables that the `spotlight` utility paints with
export function Spotlight({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  function onMove(event: PointerEvent<HTMLDivElement>) {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
    el.style.setProperty("--spot", "1");
  }

  return (
    <div
      {...rest}
      className={cn("spotlight", className)}
      onPointerMove={onMove}
      onPointerLeave={(event) => event.currentTarget.style.setProperty("--spot", "0")}
    >
      {children}
    </div>
  );
}
