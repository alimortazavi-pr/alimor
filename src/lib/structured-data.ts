import { type Dictionary } from "@/i18n";
import { type Locale, LOCALES } from "@/lib/i18n";
import { SITE } from "@/lib/site";

const PERSON_ID = `${SITE.url}/#person`;
const SITE_ID = `${SITE.url}/#website`;
const ORG_ID = `${SITE.paradise}/#organization`;

const IN_LANGUAGE: Record<Locale, string> = { fa: "fa-IR", en: "en", ar: "ar" };

// One linked graph per page: the WebSite names the site in results, ProfilePage tells Google the page is
// about a person, and the Person entity carries every name spelling plus the profiles that confirm it.
export function siteJsonLd(locale: Locale, dict: Dictionary) {
  const pageUrl = `${SITE.url}/${locale}`;
  const names = Object.values(SITE.names);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        url: SITE.url,
        name: SITE.names[locale],
        alternateName: [...names.filter((n) => n !== SITE.names[locale]), "alimor.ir"],
        inLanguage: LOCALES.map((l) => IN_LANGUAGE[l]),
        publisher: { "@id": PERSON_ID },
      },
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl}#profile`,
        url: pageUrl,
        name: dict.meta.title,
        description: dict.meta.description,
        inLanguage: IN_LANGUAGE[locale],
        isPartOf: { "@id": SITE_ID },
        mainEntity: { "@id": PERSON_ID },
        primaryImageOfPage: `${pageUrl}/opengraph-image`,
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: SITE.names[locale],
        alternateName: names.filter((n) => n !== SITE.names[locale]),
        givenName: dict.hero.firstName,
        familyName: dict.hero.lastName,
        url: SITE.url,
        image: `${SITE.url}/en/opengraph-image`,
        email: `mailto:${SITE.email}`,
        telephone: SITE.phone,
        jobTitle: dict.hero.roles[0],
        description: dict.meta.description,
        nationality: { "@type": "Country", name: "Iran" },
        knowsLanguage: ["fa", "en"],
        knowsAbout: [
          "Software Engineering",
          "Web Development",
          "Software Architecture",
          ...SITE.stack,
        ],
        founder: { "@id": ORG_ID },
        worksFor: { "@id": ORG_ID },
        sameAs: [...Object.values(SITE.socials), SITE.paradise],
      },
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "Paradise Code",
        alternateName: "پارادایس کد",
        url: SITE.paradise,
        foundingDate: "2019",
        founder: { "@id": PERSON_ID },
      },
    ],
  };
}
