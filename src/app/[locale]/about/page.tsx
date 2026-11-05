import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
import { CONTACT_EMAIL } from "@/content/legal";

const RESOURCES = [
  { name: "Associação Brasileira de Alzheimer (ABRAz)", url: "https://abraz.org.br" },
  { name: "Alzheimer's Disease International (ADI)", url: "https://alzint.org" },
  { name: "Alzheimer's Association", url: "https://alz.org" },
  { name: "National Institute on Aging", url: "https://www.nia.nih.gov/health/alzheimers-disease-and-related-dementias" },
  { name: "Alzheimer's Society (UK)", url: "https://www.alzheimers.org.uk" },
  { name: "Alzheimer Society of Canada", url: "https://alzheimer.ca" },
  { name: "Dementia Australia", url: "https://www.dementia.org.au" },
];

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMetadata({ locale, path: "/about", title: t("metaTitle"), description: t("metaDescription") });
}

export default async function About({ params }: PageProps<"/[locale]/about">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <Container className="pt-16">
      <h1 className="max-w-2xl text-4xl font-medium leading-tight sm:text-5xl">{t("title")}</h1>
      <div className="mt-8 max-w-[65ch] space-y-4 text-lg">
        <p>{t("p1")}</p>
        <p>{t("p2")}</p>
      </div>

      <section id="impact" className="mt-16 max-w-[65ch] scroll-mt-24 border-t border-ink pt-6">
        <h2 className="text-2xl font-semibold">{t("impactTitle")}</h2>
        <p className="mt-3">{t("impactBody")}</p>
      </section>

      <section className="mt-12 max-w-[65ch]">
        <h2 className="text-2xl font-semibold">{t("resourcesTitle")}</h2>
        <ul className="mt-4 divide-y divide-rule border-y border-rule">
          {RESOURCES.map((r) => (
            <li key={r.url} className="py-3">
              <a href={r.url} rel="noopener" className="text-ultra underline-offset-4 hover:underline">
                {r.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 max-w-[65ch]">
        <h2 className="text-2xl font-semibold">{t("contactTitle")}</h2>
        <p className="mt-3">
          {t("contactBody")}{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-ultra underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </section>
    </Container>
  );
}
