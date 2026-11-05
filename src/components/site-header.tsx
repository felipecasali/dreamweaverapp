import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import type { Locale } from "@/i18n/routing";
import { LocaleSwitcher } from "./locale-switcher";
import { buttonClass } from "./ui";
import { logout } from "@/lib/actions";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations("nav");
  const user = await getCurrentUser();
  const linkClass = "font-sans text-[0.95rem] text-slate hover:text-ink";

  return (
    <header className="border-b border-rule/70 bg-mist/90 backdrop-blur supports-[backdrop-filter]:bg-mist/75 sticky top-0 z-20">
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 font-sans">
        {t("skip")}
      </a>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 sm:px-8">
        <Link href="/" className="mr-auto text-xl font-semibold tracking-tight text-ink" aria-label="Dream Weaver">
          Dream Weaver
        </Link>
        <nav aria-label="Main" className="order-3 flex w-full gap-5 sm:order-none sm:w-auto">
          {user && (
            <Link href="/journal" className={linkClass}>
              {t("journal")}
            </Link>
          )}
          <Link href="/blog" className={linkClass}>
            {t("blog")}
          </Link>
          <Link href="/pricing" className={linkClass}>
            {t("pricing")}
          </Link>
          <Link href="/about" className={linkClass}>
            {t("about")}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <LocaleSwitcher current={locale} label={t("language")} />
          {user ? (
            <>
              <Link href="/account" className={linkClass}>
                {t("account")}
              </Link>
              <form action={logout}>
                <button className={`${linkClass} cursor-pointer`}>{t("logout")}</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass}>
                {t("login")}
              </Link>
              <Link href="/signup" className={buttonClass("primary", "!px-4 !py-2")}>
                {t("signup")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
