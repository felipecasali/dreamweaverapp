import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { AuthForm } from "@/components/auth-form";
import { Container } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
import { env } from "@/lib/env";

export async function generateMetadata({ params }: PageProps<"/[locale]/signup">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "auth" });
  return pageMetadata({
    locale,
    path: "/signup",
    title: `${t("signupTitle")} — Dream Weaver`,
    description: t("signupLead", { count: env.freeInterpretations }),
  });
}

export default async function Signup({ params }: PageProps<"/[locale]/signup">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  return (
    <Container className="max-w-md pt-16">
      <h1 className="text-3xl font-medium">{t("signupTitle")}</h1>
      <p className="mt-2 text-slate">{t("signupLead", { count: env.freeInterpretations })}</p>
      <div className="mt-8">
        <AuthForm mode="signup" />
      </div>
    </Container>
  );
}
