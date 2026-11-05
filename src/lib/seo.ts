import type { Metadata } from "next";
import { env } from "@/lib/env";
import { htmlLang, locales, routing, type Locale } from "@/i18n/routing";

/** Public URL path for a locale ("/about" → "/pt/about"; English has no prefix). */
export function localizedPath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path;
  return locale === routing.defaultLocale ? clean || "/" : `/${locale}${clean}`;
}

export function pageMetadata(opts: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
  type?: "website" | "article";
}): Metadata {
  const { locale, path, title, description } = opts;
  const languages: Record<string, string> = {};
  for (const l of locales) languages[htmlLang[l]] = `${env.siteUrl}${localizedPath(l, path)}`;
  languages["x-default"] = `${env.siteUrl}${localizedPath("en", path)}`;

  return {
    title,
    description,
    metadataBase: new URL(env.siteUrl),
    alternates: { canonical: localizedPath(locale, path), languages },
    openGraph: {
      title,
      description,
      url: localizedPath(locale, path),
      siteName: "Dream Weaver",
      locale: htmlLang[locale].replace("-", "_"),
      type: opts.type ?? "website",
    },
    robots: opts.noindex ? { index: false, follow: false } : undefined,
  };
}
