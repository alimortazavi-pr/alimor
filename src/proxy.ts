import { type NextRequest, NextResponse } from "next/server";

import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n";

// Every page lives under /{locale}. Bare paths pick the visitor's language when it is one we speak.
function preferredLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const code = part.trim().slice(0, 2).toLowerCase();
    if (isLocale(code)) return code;
  }
  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (isLocale(first)) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: [
    "/((?!api|_next|resume.pdf|favicon.ico|icon|apple-icon|robots.txt|sitemap.xml|manifest.webmanifest|opengraph-image).*)",
  ],
};
