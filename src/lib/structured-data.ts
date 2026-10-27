import { type Dictionary } from "@/i18n";
import { type Locale } from "@/lib/i18n";
import { SITE } from "@/lib/site";

export function personJsonLd(locale: Locale, dict: Dictionary) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ali Mortazavi",
    alternateName: locale === "en" ? undefined : `${dict.hero.firstName} ${dict.hero.lastName}`,
    url: `${SITE.url}/${locale}`,
    email: `mailto:${SITE.email}`,
    jobTitle: dict.hero.roles[0],
    description: dict.meta.description,
    knowsAbout: SITE.stack,
    founder: { "@type": "Organization", name: "Paradise Code", url: SITE.paradise },
    sameAs: Object.values(SITE.socials),
  };
}
