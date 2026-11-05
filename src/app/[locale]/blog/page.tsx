import type { Metadata } from "next";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
import { posts } from "@/content/posts";

export async function generateMetadata({ params }: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "blog" });
  return pageMetadata({ locale, path: "/blog", title: t("metaTitle"), description: t("metaDescription") });
}

export default async function Blog({ params }: PageProps<"/[locale]/blog">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const format = await getFormatter();

  return (
    <Container className="pt-16">
      <h1 className="text-4xl font-medium sm:text-5xl">{t("title")}</h1>
      <p className="mt-3 text-xl text-slate">{t("lead")}</p>
      <ul className="mt-12 divide-y divide-rule border-y border-rule">
        {posts.map((p) => (
          <li key={p.slug} className="py-6">
            <Link href={`/blog/${p.slug}`} className="group block max-w-[65ch]">
              <h2 className="text-2xl font-semibold group-hover:text-ultra">{p.content[locale].title}</h2>
              <p className="mt-2 text-slate">{p.content[locale].description}</p>
              <time dateTime={p.date} className="mt-2 block font-sans text-sm text-slate">
                {t("published", { date: format.dateTime(new Date(`${p.date}T12:00:00Z`), { dateStyle: "long" }) })}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
