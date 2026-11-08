import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { AuthForm } from "@/components/auth-form";
import { Container } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/login">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "auth" });
  return pageMetadata({ locale, path: "/login", title: `${t("loginTitle")} — Dream Weaver`, description: t("loginTitle"), noindex: true });
}

export default async function Login({ params, searchParams }: PageProps<"/[locale]/login">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("auth");
  const { next, status } = await searchParams;
  const notice = status === "confirmed" || status === "link-expired" ? status : null;

  return (
    <Container className="max-w-md pt-16">
      <h1 className="text-3xl font-medium">{t("loginTitle")}</h1>
      {notice && (
        <p role="status" className="mt-6 rounded-xl bg-dawn/60 p-4 font-sans text-sm">
          {t(`status.${notice}`)}
        </p>
      )}
      <div className="mt-8">
        <AuthForm mode="login" next={typeof next === "string" ? next : undefined} />
      </div>
    </Container>
  );
}
