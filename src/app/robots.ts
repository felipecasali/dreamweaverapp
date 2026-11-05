import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments must not be indexed
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/auth/", "/journal", "/account", "/pt/journal", "/pt/account", "/es/journal", "/es/account"] },
    sitemap: `${env.siteUrl}/sitemap.xml`,
  };
}
