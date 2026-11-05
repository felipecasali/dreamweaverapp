import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const linkClass = "hover:text-white";

  return (
    <footer className="mt-24 bg-night text-night-text">
      <div className="mx-auto grid max-w-5xl gap-8 px-5 py-12 sm:grid-cols-[1.4fr_1fr] sm:px-8">
        <div>
          <p className="text-xl font-semibold">Dream Weaver</p>
          <p className="mt-2 max-w-sm text-night-text/75">{t("tagline")}</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-2 font-sans text-sm text-night-text/80">
          <Link href="/blog" className={linkClass}>{nav("blog")}</Link>
          <Link href="/pricing" className={linkClass}>{nav("pricing")}</Link>
          <Link href="/about" className={linkClass}>{nav("about")}</Link>
          <Link href="/privacy" className={linkClass}>{t("privacy")}</Link>
          <Link href="/terms" className={linkClass}>{t("terms")}</Link>
        </nav>
        <p className="font-sans text-xs text-night-text/60 sm:col-span-2">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
