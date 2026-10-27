import type { Locale } from "@/lib/i18n";

import { ar } from "./ar";
import { en } from "./en";
import { type Dictionary, fa } from "./fa";

export type { Dictionary };

const DICTIONARIES: Record<Locale, Dictionary> = { fa, en, ar };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
