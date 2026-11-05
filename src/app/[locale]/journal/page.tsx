import type { Metadata } from "next";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo";
import { env } from "@/lib/env";
import { Container, buttonClass } from "@/components/ui";
import { Composer, DreamView } from "@/components/journal";

export async function generateMetadata({ params }: PageProps<"/[locale]/journal">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "journal" });
  return pageMetadata({ locale, path: "/journal", title: t("metaTitle"), description: t("metaTitle"), noindex: true });
}

type Dream = { id: string; title: string | null; content: string; dreamed_on: string; sentiment: number | null };

export default async function Journal({ params, searchParams }: PageProps<"/[locale]/journal">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : "";
  const selectedId = typeof sp.id === "string" ? sp.id : undefined;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect({ href: "/login?next=/journal", locale });

  const t = await getTranslations("journal");
  const format = await getFormatter();

  let listQuery = supabase
    .from("dreams")
    .select("id, title, content, dreamed_on, sentiment")
    .order("dreamed_on", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(100);
  if (q) listQuery = listQuery.textSearch("search", q, { type: "websearch", config: "simple" });

  const [{ data: dreams }, { data: profile }, { count: used }] = await Promise.all([
    listQuery,
    supabase.from("profiles").select("plan").eq("id", user!.id).single(),
    supabase.from("interpretations").select("id", { count: "exact", head: true }),
  ]);

  const list = (dreams ?? []) as Dream[];
  const isFree = (profile?.plan ?? "free") === "free";
  const usedCount = used ?? 0;
  const quotaLeft = isFree ? Math.max(0, env.freeInterpretations - usedCount) : Infinity;

  let selected: (Dream & { interpretations: { id: string; style: string; content: string; created_at: string; feedback: number | null }[] }) | null = null;
  if (selectedId) {
    const { data } = await supabase
      .from("dreams")
      .select("id, title, content, dreamed_on, sentiment, interpretations(id, style, content, created_at, feedback)")
      .eq("id", selectedId)
      .order("created_at", { referencedTable: "interpretations", ascending: false })
      .maybeSingle();
    selected = data;
  }

  // Mood strip: oldest → newest of the 30 most recent dreams with a sentiment
  const mood = list.filter((d) => d.sentiment !== null).slice(0, 30).reverse();
  const moodLabel = (s: number) => (s > 0 ? t("mood.pleasant") : s < 0 ? t("mood.unsettling") : t("mood.neutral"));

  return (
    <Container className="pt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-medium">{t("title")}</h1>
        {selected && (
          <Link href="/journal" className={buttonClass("quiet")}>
            {t("newDream")}
          </Link>
        )}
      </div>

      {isFree && (
        <p className="mt-2 font-sans text-sm text-slate">
          {quotaLeft > 0 ? t("quota", { used: Math.min(usedCount, env.freeInterpretations), limit: env.freeInterpretations }) : t("quotaReached")}
        </p>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_20rem]">
        <section aria-live="polite">
          {selected ? (
            <DreamView
              dream={selected}
              dateLabel={format.dateTime(new Date(`${selected.dreamed_on}T12:00:00Z`), { dateStyle: "long" })}
              quotaLeft={quotaLeft}
            />
          ) : (
            <Composer quotaLeft={quotaLeft} />
          )}
        </section>

        <aside className="lg:border-l lg:border-rule lg:pl-8">
          <form role="search" className="mb-5">
            <label htmlFor="q" className="sr-only">
              {t("search")}
            </label>
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={q}
              placeholder={t("search")}
              className="w-full rounded-full border border-rule bg-paper px-4 py-2 font-sans text-sm focus:border-ultra focus:outline-none"
            />
          </form>

          {mood.length > 1 && (
            <figure className="mb-6">
              <figcaption className="font-sans text-xs text-slate">{t("moodTitle")}</figcaption>
              <ol className="mt-2 flex h-10 items-end gap-1" aria-label={t("moodTitle")}>
                {mood.map((d) => (
                  <li
                    key={d.id}
                    title={`${d.title ?? ""} — ${moodLabel(d.sentiment!)}`}
                    className="w-2 rounded-full"
                    style={{
                      height: d.sentiment! > 0 ? "100%" : d.sentiment! < 0 ? "30%" : "62%",
                      background: d.sentiment! > 0 ? "var(--ultra)" : d.sentiment! < 0 ? "var(--slate)" : "var(--rule)",
                    }}
                  >
                    <span className="sr-only">{moodLabel(d.sentiment!)}</span>
                  </li>
                ))}
              </ol>
            </figure>
          )}

          {list.length === 0 ? (
            <p className="font-sans text-sm text-slate">{q ? t("noResults", { query: q }) : t("empty")}</p>
          ) : (
            <ul className="divide-y divide-rule">
              {list.map((d) => (
                <li key={d.id}>
                  <Link
                    href={{ pathname: "/journal", query: { id: d.id, ...(q ? { q } : {}) } }}
                    aria-current={d.id === selectedId ? "page" : undefined}
                    className="block py-3 hover:text-ultra aria-[current=page]:text-ultra"
                  >
                    <span className="block font-semibold leading-snug">{d.title ?? d.content.slice(0, 48)}</span>
                    <time dateTime={d.dreamed_on} className="font-sans text-xs text-slate">
                      {format.dateTime(new Date(`${d.dreamed_on}T12:00:00Z`), { dateStyle: "medium" })}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </Container>
  );
}
