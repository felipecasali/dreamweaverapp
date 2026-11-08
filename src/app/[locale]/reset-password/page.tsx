import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { ResetPasswordForm } from "@/components/password-forms";
import { Container } from "@/components/ui";
import { getCurrentUser } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/reset-password">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "auth" });
  return pageMetadata({ locale, path: "/reset-password", title: `${t("resetTitle")} — Dream Weaver`, description: t("resetTitle"), noindex: true });
}

/** Reached from the recovery email: /auth/confirm has already signed the user in. */
export default async function ResetPassword({ params }: PageProps<"/[locale]/reset-password">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  if (!(await getCurrentUser())) redirect({ href: "/login?status=link-expired", locale });
  const t = await getTranslations("auth");

  return (
    <Container className="max-w-md pt-16">
      <h1 className="text-3xl font-medium">{t("resetTitle")}</h1>
      <div className="mt-8">
        <ResetPasswordForm />
      </div>
    </Container>
  );
}
