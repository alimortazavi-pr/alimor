"use client";

import { ArrowRight, Copy, Download, ExternalLink, Globe, Hash, Mail, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { scrollToTarget } from "@/components/providers/smooth-scroll";
import { type Dictionary } from "@/i18n";
import { cn } from "@/lib/cn";
import { type Locale, LOCALE_META, LOCALES } from "@/lib/i18n";
import { SITE } from "@/lib/site";

import { navItems } from "./nav-items";
import { onOpenPalette } from "./palette-bus";

interface Action {
  id: string;
  group: string;
  label: string;
  icon: ReactNode;
  run: () => void;
}

interface PaletteProps {
  locale: Locale;
  dict: Dictionary;
  resume: boolean;
}

export function CommandPalette({ locale, dict, resume }: PaletteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    const off = onOpenPalette(() => setOpen(true));
    return () => {
      window.removeEventListener("keydown", onKey);
      off();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const id = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      window.clearTimeout(id);
      previous?.focus();
    };
  }, [open]);

  const actions = useMemo<Action[]>(() => {
    const p = dict.palette;
    const list: Action[] = [
      {
        id: "top",
        group: p.sections,
        label: dict.hero.firstName + " " + dict.hero.lastName,
        icon: <Hash className="size-4" />,
        run: () => scrollToTarget("#top"),
      },
      ...navItems(dict.nav).map((item) => ({
        id: item.id,
        group: p.sections,
        label: item.label,
        icon: <Hash className="size-4" />,
        run: () => scrollToTarget(`#${item.id}`),
      })),
      {
        id: "copy",
        group: p.actions,
        label: p.copyEmail,
        icon: <Copy className="size-4" />,
        run: () => void navigator.clipboard?.writeText(SITE.email),
      },
      {
        id: "mail",
        group: p.actions,
        label: p.sendEmail,
        icon: <Mail className="size-4" />,
        run: () => (window.location.href = `mailto:${SITE.email}`),
      },
      {
        id: "paradise",
        group: p.actions,
        label: dict.paradise.cta,
        icon: <ExternalLink className="size-4" />,
        run: () => window.open(SITE.paradise, "_blank", "noopener"),
      },
    ];
    if (resume) {
      list.push({
        id: "resume",
        group: p.actions,
        label: dict.contact.resume,
        icon: <Download className="size-4" />,
        run: () => window.open("/resume.pdf", "_blank"),
      });
    }
    for (const l of LOCALES) {
      if (l === locale) continue;
      list.push({
        id: `lang-${l}`,
        group: p.languages,
        label: LOCALE_META[l].label,
        icon: <Globe className="size-4" />,
        run: () => router.push(`/${l}`),
      });
    }
    return list;
  }, [dict, locale, resume, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? actions.filter((a) => a.label.toLowerCase().includes(q) || a.id.includes(q))
      : actions;
  }, [actions, query]);

  function close() {
    setOpen(false);
    setQuery("");
    setActive(0);
  }

  function select(action: Action | undefined) {
    if (!action) return;
    close();
    action.run();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") close();
    else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (i + 1) % Math.max(filtered.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      select(filtered[active]);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 px-4 pt-[14vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          data-lenis-prevent
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={dict.a11y.palette}
            className="glass w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
            initial={{ y: 20, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 10, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b px-4">
              <Search className="text-muted size-4" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                placeholder={dict.palette.placeholder}
                aria-label={dict.palette.placeholder}
                className="w-full bg-transparent py-4 outline-none"
              />
              <kbd className="text-faint rounded border px-1.5 font-mono text-[10px]">ESC</kbd>
            </div>
            <ul role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <li className="text-muted px-3 py-6 text-center text-sm">{dict.palette.empty}</li>
              ) : null}
              {filtered.map((action, i) => {
                const header = filtered[i - 1]?.group !== action.group ? action.group : null;
                return (
                  <li key={action.id} role="presentation">
                    {header ? (
                      <p className="text-faint px-3 pt-3 pb-1.5 font-mono text-[10px] tracking-widest uppercase">
                        {header}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      role="option"
                      aria-selected={i === active}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => select(action)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm transition-colors",
                        i === active ? "text-foreground bg-white/[0.07]" : "text-muted",
                      )}
                    >
                      {action.icon}
                      <span className="flex-1">{action.label}</span>
                      {i === active ? <ArrowRight className="size-4 rtl:-scale-x-100" /> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
