import { defineRouting } from "next-intl/routing";

export const locales = ["en", "pt", "es"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  // English keeps the legacy URLs (/about, /blog/...); Portuguese and Spanish
  // get their own indexable paths (/pt/..., /es/...).
  localePrefix: "as-needed",
});

export const htmlLang: Record<Locale, string> = {
  en: "en",
  pt: "pt-BR",
  es: "es",
};
