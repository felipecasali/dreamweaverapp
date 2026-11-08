import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { ForgotPasswordForm } from "@/components/password-forms";
import { Container } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/forgot-password">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "auth" });
  return pageMetadata({ locale, path: "/forgot-password", title: `${t("forgotTitle")} — Dream Weaver`, description: t("forgotLead"), noindex: true });
}

export default async function ForgotPassword({ params }: PageProps<"/[locale]/forgot-password">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  return (
    <Container className="max-w-md pt-16">
      <h1 className="text-3xl font-medium">{t("forgotTitle")}</h1>
      <p className="mt-2 text-slate">{t("forgotLead")}</p>
      <div className="mt-8">
        <ForgotPasswordForm />
      </div>
    </Container>
  );
}
