import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import localFont from "next/font/local";
import { htmlLang, routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "../globals.css";

// Self-hosted (SIL Open Font License): no request to Google Fonts from visitors' browsers.
const newsreader = localFont({
  src: [
    { path: "../../fonts/newsreader-latin-opsz-normal.woff2", style: "normal", weight: "200 800" },
    { path: "../../fonts/newsreader-latin-opsz-italic.woff2", style: "italic", weight: "200 800" },
  ],
  variable: "--font-newsreader",
  display: "swap",
});

const plex = localFont({
  src: [
    { path: "../../fonts/ibm-plex-sans-latin-400-normal.woff2", weight: "400" },
    { path: "../../fonts/ibm-plex-sans-latin-500-normal.woff2", weight: "500" },
    { path: "../../fonts/ibm-plex-sans-latin-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-plex",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={htmlLang[locale]} className={`${newsreader.variable} ${plex.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          <SiteHeader locale={locale} />
          <main id="content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
