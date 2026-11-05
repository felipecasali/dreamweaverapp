import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/ui";
import { HeroDraft } from "@/components/hero-draft";
import { getCurrentUser } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo";
import { env } from "@/lib/env";
import { posts } from "@/content/posts";
import { STYLES } from "@/lib/ai/types";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "home" });
  return pageMetadata({ locale, path: "/", title: t("metaTitle"), description: t("metaDescription") });
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const s = await getTranslations("styles");
  const user = await getCurrentUser();
  const steps = ["write", "lens", "keep"] as const;

  return (
    <>
      <section className="horizon -mt-px pb-20 pt-16 sm:pt-24">
        <Container className="max-w-3xl">
          <h1 className="rise text-[2.6rem] font-medium leading-[1.05] tracking-tight text-night-text sm:text-[4.25rem]">
            {t("heroTitle")}
          </h1>
          <p className="rise mt-5 max-w-xl text-xl text-night-text/80 [animation-delay:80ms]">{t("heroLead")}</p>
          <HeroDraft
            label={t("heroTitle")}
            placeholder={t("placeholder")}
            cta={t("cta")}
            note={t("ctaNote", { count: env.freeInterpretations })}
            signedIn={Boolean(user)}
          />
        </Container>
      </section>

      <Container className="mt-8">
        <h2 className="max-w-xl text-3xl font-medium leading-tight">{t("howTitle")}</h2>
        <ol className="mt-10 grid gap-10 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step} className="border-t border-ink pt-4">
              <span className="font-sans text-sm text-slate">{i + 1}</span>
              <h3 className="mt-1 text-xl font-semibold">{t(`steps.${step}.title`)}</h3>
              <p className="mt-2 text-slate">{t(`steps.${step}.body`)}</p>
            </li>
          ))}
        </ol>
      </Container>

      <Container className="mt-24">
        <h2 className="text-3xl font-medium leading-tight">{t("stylesTitle")}</h2>
        <dl className="mt-8 divide-y divide-rule border-y border-rule">
          {STYLES.map((style) => (
            <div key={style} className="grid gap-1 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
              <dt className="text-lg font-semibold">{s(style)}</dt>
              <dd className="text-slate">{s(`desc.${style}`)}</dd>
            </div>
          ))}
        </dl>
      </Container>

      <Container className="mt-24 grid gap-12 sm:grid-cols-2">
        <section>
          <h2 className="text-2xl font-medium">{t("privacyTitle")}</h2>
          <p className="mt-3 text-slate">{t("privacyBody")}</p>
        </section>
        <section>
          <h2 className="text-2xl font-medium">{t("impactTitle")}</h2>
          <p className="mt-3 text-slate">{t("impactBody")}</p>
          <Link href="/about" className="mt-3 inline-block font-sans text-ultra underline underline-offset-4 hover:text-ultra-strong">
            {t("impactLink")}
          </Link>
        </section>
      </Container>

      <Container className="mt-24">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-medium">{t("blogTitle")}</h2>
          <Link href="/blog" className="font-sans text-sm text-ultra underline underline-offset-4">
            {t("blogAll")}
          </Link>
        </div>
        <ul className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="group block">
                <span className="text-lg font-semibold group-hover:text-ultra">{p.content[locale].title}</span>
                <span className="mt-1 block text-base text-slate">{p.content[locale].description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
