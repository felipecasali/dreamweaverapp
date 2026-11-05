import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { LegalPage } from "@/components/legal-page";
import { pageMetadata } from "@/lib/seo";
import { terms } from "@/content/legal";

export async function generateMetadata({ params }: PageProps<"/[locale]/terms">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const doc = terms[locale];
  return pageMetadata({ locale, path: "/terms", title: `${doc.title} — Dream Weaver`, description: doc.body[2] });
}

export default async function Terms({ params }: PageProps<"/[locale]/terms">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  return <LegalPage {...terms[locale]} />;
}
