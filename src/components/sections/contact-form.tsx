"use client";

import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, useState } from "react";

import { type Dictionary } from "@/i18n";
import { contactSchema } from "@/lib/contact-schema";
import { type Locale } from "@/lib/i18n";

type Status = "idle" | "sending" | "success" | "error" | "invalid" | "limited";

const FIELD =
  "peer w-full border-b bg-transparent pt-7 pb-3 text-lg outline-none transition-colors placeholder:text-transparent focus:border-[var(--accent)]";
const LABEL =
  "text-muted pointer-events-none absolute start-0 top-7 origin-[0] text-lg transition-all duration-300 peer-focus:top-0 peer-focus:text-xs peer-focus:text-[var(--accent)] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs rtl:origin-[100%]";

export function ContactForm({
  dict,
  locale,
}: {
  dict: Dictionary["contact"]["form"];
  locale: Locale;
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const parsed = contactSchema.safeParse({ ...data, locale });
    if (!parsed.success) {
      setStatus("invalid");
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (response.ok) {
        form.reset();
        setStatus("success");
      } else {
        setStatus(
          response.status === 429 ? "limited" : response.status === 400 ? "invalid" : "error",
        );
      }
    } catch {
      setStatus("error");
    }
  }

  const feedback =
    status === "success"
      ? dict.success
      : status === "error"
        ? dict.error
        : status === "invalid"
          ? dict.invalid
          : status === "limited"
            ? dict.limited
            : null;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="relative">
          <input
            id="name"
            name="name"
            required
            minLength={2}
            maxLength={80}
            placeholder={dict.name}
            className={FIELD}
            autoComplete="name"
          />
          <label htmlFor="name" className={LABEL}>
            {dict.name}
          </label>
        </div>
        <div className="relative">
          <input
            id="reply"
            name="reply"
            required
            minLength={5}
            maxLength={120}
            placeholder={dict.reply}
            className={FIELD}
            dir="auto"
            autoComplete="email"
          />
          <label htmlFor="reply" className={LABEL}>
            {dict.reply}
          </label>
        </div>
      </div>
      <div className="relative">
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={3000}
          rows={4}
          placeholder={dict.messagePlaceholder}
          className={`${FIELD} resize-none`}
        />
        <label htmlFor="message" className={LABEL}>
          {dict.message}
        </label>
      </div>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -start-[9999px] size-px opacity-0"
      />

      <div className="flex flex-wrap items-center gap-5 pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          data-cursor="hover"
          className="bg-foreground text-background group inline-flex items-center gap-3 rounded-full py-3 ps-7 pe-3 font-semibold transition-all hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] disabled:opacity-60"
        >
          {status === "sending" ? dict.sending : dict.submit}
          <span className="bg-background text-foreground grid size-9 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-45 rtl:-scale-x-100">
            {status === "sending" ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : status === "success" ? (
              <Check className="size-4" />
            ) : (
              <ArrowUpRight className="size-4" />
            )}
          </span>
        </button>
        <AnimatePresence mode="wait">
          {feedback ? (
            <motion.p
              key={status}
              role="status"
              className={status === "success" ? "text-accent" : "text-ember"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              {feedback}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  );
}
