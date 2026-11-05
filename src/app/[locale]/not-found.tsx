import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container, buttonClass } from "@/components/ui";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <Container className="max-w-xl pt-24">
      <h1 className="text-4xl font-medium">{t("title")}</h1>
      <p className="mt-3 text-slate">{t("body")}</p>
      <Link href="/" className={buttonClass("primary", "mt-8")}>
        {t("home")}
      </Link>
    </Container>
  );
}
