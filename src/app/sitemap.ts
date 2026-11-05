import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { htmlLang, locales } from "@/i18n/routing";
import { localizedPath } from "@/lib/seo";
import { posts } from "@/content/posts";

const PAGES = ["/", "/pricing", "/about", "/blog", "/privacy", "/terms", "/signup"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, lastModified?: string): MetadataRoute.Sitemap =>
    locales.map((locale) => ({
      url: `${env.siteUrl}${localizedPath(locale, path)}`,
      lastModified,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [htmlLang[l], `${env.siteUrl}${localizedPath(l, path)}`])),
      },
    }));

  return [...PAGES.flatMap((p) => entry(p)), ...posts.flatMap((p) => entry(`/blog/${p.slug}`, p.date))];
}
