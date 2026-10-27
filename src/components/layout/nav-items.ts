import { type Dictionary } from "@/i18n";

export const NAV_SECTIONS = ["about", "journey", "craft", "paradise", "contact"] as const;
export type NavSection = (typeof NAV_SECTIONS)[number];

export function navItems(nav: Dictionary["nav"]) {
  return NAV_SECTIONS.map((id) => ({ id, label: nav[id] }));
}
