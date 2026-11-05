import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { LegalPage } from "@/components/legal-page";
import { pageMetadata } from "@/lib/seo";
import { privacy } from "@/content/legal";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const doc = privacy[locale];
  return pageMetadata({ locale, path: "/privacy", title: `${doc.title} — Dream Weaver`, description: doc.body[0] });
}

export default async function Privacy({ params }: PageProps<"/[locale]/privacy">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  return <LegalPage {...privacy[locale]} />;
}
