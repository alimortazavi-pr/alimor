"use client";

import { Command, Menu, Pause, Play, X } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

import { useMotionPreference } from "@/components/providers/motion-preference";
import { scrollToTarget } from "@/components/providers/smooth-scroll";
import { type Dictionary } from "@/i18n";
import { cn } from "@/lib/cn";
import { type Locale, LOCALE_META, LOCALES } from "@/lib/i18n";

import { navItems } from "./nav-items";
import { openPalette } from "./palette-bus";

interface HeaderProps {
  locale: Locale;
  brand: string;
  nav: Dictionary["nav"];
  a11y: Dictionary["a11y"];
}

function LocaleSwitch({ locale, label }: { locale: Locale; label: string }) {
  return (
    <nav aria-label={label} className="flex items-center rounded-full border p-0.5 text-xs">
      {LOCALES.map((l) => (
        <a
          key={l}
          href={`/${l}`}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? "true" : undefined}
          className={cn(
            "rounded-full px-2.5 py-1 transition-colors",
            l === locale ? "bg-foreground text-background" : "text-muted hover:text-foreground",
          )}
        >
          {LOCALE_META[l].short}
        </a>
      ))}
    </nav>
  );
}

export function SiteHeader({ locale, brand, nav, a11y }: HeaderProps) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { enabled, toggle } = useMotionPreference();
  const items = navItems(nav);

  // Out of the way while reading down, back as soon as the visitor scrolls up
  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(y > previous && y > 400);
    setScrolled(y > 40);
  });

  function go(id: string) {
    setOpen(false);
    scrollToTarget(`#${id}`);
  }

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-6 sm:pt-5"
        animate={{ y: hidden && !open ? "-130%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={cn(
            "flex w-full max-w-6xl items-center justify-between gap-4 rounded-full py-2 ps-5 pe-2 transition-all duration-500",
            scrolled || open ? "glass" : "border border-transparent",
          )}
        >
          <a
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              go("top");
            }}
            className="font-display flex items-center gap-2 font-bold tracking-tight"
          >
            <span
              className="bg-accent text-accent-foreground grid size-8 place-items-center rounded-full text-xs"
              dir="ltr"
            >
              AM
            </span>
            <span className="hidden sm:inline">{brand}</span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  go(item.id);
                }}
                className="text-muted hover:text-foreground relative rounded-full px-3.5 py-2 text-sm transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openPalette}
              aria-label={a11y.palette}
              className="text-muted hover:text-foreground hidden items-center gap-1 rounded-full border px-2.5 py-1.5 font-mono text-xs transition-colors sm:inline-flex"
            >
              <Command className="size-3.5" />K
            </button>
            <button
              type="button"
              onClick={toggle}
              aria-label={enabled ? a11y.motionOff : a11y.motionOn}
              aria-pressed={!enabled}
              className="text-muted hover:text-foreground hidden size-8 place-items-center rounded-full border transition-colors sm:grid"
            >
              {enabled ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            </button>
            <div className="hidden sm:block">
              <LocaleSwitch locale={locale} label={a11y.language} />
            </div>
            <a
              href="#contact"
              onClick={(event) => {
                event.preventDefault();
                go("contact");
              }}
              className="bg-foreground text-background hidden rounded-full px-5 py-2 text-sm font-semibold transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] md:inline-block"
            >
              {nav.cta}
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? a11y.close : a11y.menu}
              aria-expanded={open}
              className="grid size-10 place-items-center rounded-full border lg:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="bg-background/95 fixed inset-0 z-40 flex flex-col justify-between px-6 pt-28 pb-10 backdrop-blur-xl lg:hidden"
            initial={{ clipPath: "circle(0% at 90% 5%)" }}
            animate={{ clipPath: "circle(150% at 90% 5%)" }}
            exit={{ clipPath: "circle(0% at 90% 5%)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className="flex flex-col gap-2">
              {items.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    go(item.id);
                  }}
                  className="font-display flex items-baseline gap-4 text-5xl font-bold tracking-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="text-accent font-mono text-sm">0{i + 1}</span>
                  {item.label}
                </motion.a>
              ))}
            </nav>
            <div className="flex items-center justify-between">
              <LocaleSwitch locale={locale} label={a11y.language} />
              <button
                type="button"
                onClick={toggle}
                className="text-muted flex items-center gap-2 text-sm"
              >
                {enabled ? <Pause className="size-4" /> : <Play className="size-4" />}
                {enabled ? a11y.motionOff : a11y.motionOn}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
