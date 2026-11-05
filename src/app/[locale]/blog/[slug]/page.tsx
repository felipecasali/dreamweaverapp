import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Container, buttonClass } from "@/components/ui";
import { Prose } from "@/components/prose";
import { pageMetadata, localizedPath } from "@/lib/seo";
import { env } from "@/lib/env";
import { getPost, posts } from "@/content/posts";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => posts.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const c = post.content[locale as Locale];
  return pageMetadata({ locale: locale as Locale, path: `/blog/${slug}`, title: `${c.title} — Dream Weaver`, description: c.description, type: "article" });
}

export default async function PostPage({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const { locale: l, slug } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const post = getPost(slug);
  if (!post) notFound();

  const t = await getTranslations("blog");
  const format = await getFormatter();
  const c = post.content[locale];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: c.title,
    description: c.description,
    datePublished: post.date,
    inLanguage: locale === "pt" ? "pt-BR" : locale,
    author: { "@type": "Person", name: "Felipe Casali" },
    publisher: { "@type": "Organization", name: "Dream Weaver" },
    mainEntityOfPage: `${env.siteUrl}${localizedPath(locale, `/blog/${slug}`)}`,
  };

  return (
    <Container className="pt-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/blog" className="font-sans text-sm text-slate hover:text-ink">
        ← {t("back")}
      </Link>
      <article className="mt-8">
        <h1 className="max-w-[22ch] text-4xl font-medium leading-tight sm:text-5xl">{c.title}</h1>
        <p className="mt-4 max-w-[60ch] text-xl text-slate">{c.description}</p>
        <p className="mt-4 flex flex-wrap gap-x-4 font-sans text-sm text-slate">
          <span>Felipe Casali</span>
          <time dateTime={post.date}>
            {t("published", { date: format.dateTime(new Date(`${post.date}T12:00:00Z`), { dateStyle: "long" }) })}
          </time>
        </p>
        <div className="mt-8">
          <Prose body={c.body} />
        </div>

        {post.sources.length > 0 && (
          <section className="mt-12 max-w-[65ch] border-t border-rule pt-4">
            <h2 className="font-sans text-sm font-semibold">{t("sources")}</h2>
            <ul className="mt-2 space-y-1 font-sans text-sm">
              {post.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} rel="noopener" className="text-ultra underline underline-offset-4">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      <aside className="mt-16 max-w-[65ch] rounded-2xl bg-dawn/60 p-8">
        <h2 className="text-2xl font-semibold">{t("ctaTitle")}</h2>
        <p className="mt-2 text-slate">{t("ctaBody")}</p>
        <Link href="/" className={buttonClass("primary", "mt-5")}>
          {t("ctaButton")}
        </Link>
      </aside>
    </Container>
  );
}
