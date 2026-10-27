import { existsSync } from "node:fs";
import { join } from "node:path";

import { notFound } from "next/navigation";

import { CommandPalette } from "@/components/layout/command-palette";
import { Cursor } from "@/components/layout/cursor";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Craft } from "@/components/sections/craft";
import { Hero } from "@/components/sections/hero";
import { Journey } from "@/components/sections/journey";
import { Paradise } from "@/components/sections/paradise";
import { Stats } from "@/components/sections/stats";
import { getDictionary } from "@/i18n";
import { isLocale, localizeDigits } from "@/lib/i18n";
import { personJsonLd } from "@/lib/structured-data";

// Checked at build time: the résumé buttons only appear once public/resume.pdf exists
const HAS_RESUME = existsSync(join(process.cwd(), "public", "resume.pdf"));

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const brand = `${dict.hero.firstName} ${dict.hero.lastName}`;
  const n = (i: number) => localizeDigits(`0${i}`, locale);

  return (
    <>
      <SiteHeader locale={locale} brand={brand} nav={dict.nav} a11y={dict.a11y} />
      <main id="main">
        <Hero locale={locale} dict={dict.hero} resume={HAS_RESUME} />
        <About dict={dict.about} index={n(1)} />
        <Stats dict={dict.stats} locale={locale} index={n(2)} />
        <Journey dict={dict.journey} locale={locale} index={n(3)} />
        <Craft dict={dict.craft} index={n(4)} />
        <Paradise dict={dict.paradise} index={n(5)} />
        <Contact dict={dict.contact} locale={locale} resume={HAS_RESUME} index={n(6)} />
      </main>
      <SiteFooter dict={dict.footer} locale={locale} brand={brand} />
      <CommandPalette locale={locale} dict={dict} resume={HAS_RESUME} />
      <Cursor />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(locale, dict)) }}
      />
    </>
  );
}
