import "../globals.css";

import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Geist,
  Instrument_Serif,
  JetBrains_Mono,
  Vazirmatn,
} from "next/font/google";
import { notFound } from "next/navigation";

import { AppProviders } from "@/components/providers/app-providers";
import { getDictionary } from "@/i18n";
import { cn } from "@/lib/cn";
import { isLocale, LOCALE_META, localeDir, LOCALES } from "@/lib/i18n";
import { SITE } from "@/lib/site";

// Fonts are fetched at build time and served from the site itself: the server cannot reach Google
const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#070709",
  colorScheme: "dark",
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const name = SITE.names[locale];
  return {
    metadataBase: new URL(SITE.url),
    title: { absolute: dict.meta.title },
    description: dict.meta.description,
    applicationName: name,
    authors: [{ name, url: SITE.url }],
    creator: name,
    publisher: name,
    keywords: [
      ...Object.values(SITE.names),
      ...dict.hero.roles.slice(0, 3),
      "Paradise Code",
      "پارادایس کد",
      "alimor",
    ],
    alternates: {
      canonical: `/${locale}`,
      languages: { ...Object.fromEntries(LOCALES.map((l) => [l, `/${l}`])), "x-default": "/fa" },
    },
    openGraph: {
      type: "profile",
      siteName: name,
      title: dict.meta.title,
      description: dict.meta.description,
      locale: LOCALE_META[locale].og,
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => LOCALE_META[l].og),
      url: `/${locale}`,
      firstName: dict.hero.firstName,
      lastName: dict.hero.lastName,
      username: "alimortazavi-pr",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    // Search Console: set the token at build time if the HTML-tag method is used instead of a DNS record
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : undefined,
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html
      lang={locale}
      dir={localeDir(locale)}
      suppressHydrationWarning
      className={cn(
        "antialiased",
        vazirmatn.variable,
        bricolage.variable,
        geist.variable,
        instrument.variable,
        jetbrains.variable,
      )}
    >
      <body className="grain min-h-dvh font-sans">
        <a
          href="#main"
          className="bg-accent text-accent-foreground sr-only z-[90] rounded-full px-4 py-2 focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
        >
          {dict.a11y.skip}
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
