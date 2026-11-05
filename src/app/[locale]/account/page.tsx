import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo";
import { Container, buttonClass } from "@/components/ui";
import { DeleteAccountForm, ProfileForm } from "@/components/account-forms";

export async function generateMetadata({ params }: PageProps<"/[locale]/account">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "account" });
  return pageMetadata({ locale, path: "/account", title: t("metaTitle"), description: t("metaTitle"), noindex: true });
}

export default async function Account({ params }: PageProps<"/[locale]/account">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect({ href: "/login?next=/account", locale });

  const t = await getTranslations("account");
  const { data: profile } = await supabase
    .from("profiles")
    .select("birth_date, locale, ai_training_opt_in, plan")
    .eq("id", user!.id)
    .single();

  return (
    <Container className="max-w-2xl pt-12">
      <h1 className="text-3xl font-medium">{t("title")}</h1>

      <dl className="mt-8 grid grid-cols-[8rem_1fr] gap-y-3 border-y border-rule py-5 font-sans text-[0.95rem]">
        <dt className="text-slate">{t("email")}</dt>
        <dd>{user!.email}</dd>
        <dt className="text-slate">{t("plan")}</dt>
        <dd>{profile?.plan === "supporter" ? t("planSupporter") : t("planFree")}</dd>
      </dl>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">{t("profileTitle")}</h2>
        <div className="mt-5">
          <ProfileForm profile={{ birth_date: profile?.birth_date ?? null, locale: profile?.locale ?? locale, ai_training_opt_in: profile?.ai_training_opt_in ?? false }} />
        </div>
      </section>

      <section className="mt-14 border-t border-rule pt-8">
        <h2 className="text-2xl font-semibold">{t("dataTitle")}</h2>
        <div className="mt-5">
          <a href="/api/export" className={buttonClass("quiet")} download>
            {t("export")}
          </a>
          <p className="mt-2 font-sans text-sm text-slate">{t("exportHelp")}</p>
        </div>
        <div className="mt-10 rounded-2xl border border-danger/40 p-6">
          <h3 className="text-xl font-semibold">{t("delete")}</h3>
          <p className="mb-4 mt-1 font-sans text-sm text-slate">{t("deleteHelp")}</p>
          <DeleteAccountForm />
        </div>
      </section>
    </Container>
  );
}
