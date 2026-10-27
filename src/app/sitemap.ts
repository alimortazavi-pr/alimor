import type { MetadataRoute } from "next";

import { LOCALES } from "@/lib/i18n";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(LOCALES.map((l) => [l, `${SITE.url}/${l}`]));
  return LOCALES.map((locale) => ({
    url: `${SITE.url}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === "fa" ? 1 : 0.9,
    alternates: { languages },
  }));
}
