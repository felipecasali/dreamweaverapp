import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Container, buttonClass } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
import { env } from "@/lib/env";

export async function generateMetadata({ params }: PageProps<"/[locale]/pricing">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "pricing" });
  return pageMetadata({ locale, path: "/pricing", title: t("metaTitle"), description: t("metaDescription") });
}

export default async function Pricing({ params }: PageProps<"/[locale]/pricing">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("pricing");
  const count = env.freeInterpretations;
  const freeItems = t.raw("free.items") as string[];
  const supporterItems = t.raw("supporter.items") as string[];

  return (
    <Container className="pt-16">
      <h1 className="max-w-2xl text-4xl font-medium leading-tight sm:text-5xl">{t("title")}</h1>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-rule bg-paper p-8">
          <h2 className="text-2xl font-semibold">{t("free.name")}</h2>
          <p className="mt-2 text-4xl">{t("free.price")}</p>
          <ul className="mt-6 space-y-2 text-slate">
            {freeItems.map((item) => (
              <li key={item} className="border-t border-rule pt-2">
                {item.replace("{count}", String(count))}
              </li>
            ))}
          </ul>
          <Link href="/signup" className={buttonClass("primary", "mt-8")}>
            {t("free.cta")}
          </Link>
        </section>

        <section className="rounded-2xl border-2 border-ink bg-dawn/50 p-8">
          <h2 className="text-2xl font-semibold">{t("supporter.name")}</h2>
          <p className="mt-2 text-4xl">
            {t("supporter.price")} <span className="font-sans text-base text-slate">{t("supporter.per")}</span>
          </p>
          <ul className="mt-6 space-y-2 text-slate">
            {supporterItems.map((item) => (
              <li key={item} className="border-t border-ink/20 pt-2">
                {item}
              </li>
            ))}
          </ul>
          <button disabled className={buttonClass("quiet", "mt-8")}>
            {t("supporter.cta")}
          </button>
          <p className="mt-3 font-sans text-sm text-slate">{t("supporter.soon")}</p>
        </section>
      </div>

      <p className="mt-8 max-w-2xl text-slate">{t("impactNote")}</p>
    </Container>
  );
}
