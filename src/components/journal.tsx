"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { STYLES, type InterpretationStyle } from "@/lib/ai/types";
import { deleteDream, setFeedback } from "@/lib/actions";
import { Button, fieldClass, labelClass } from "./ui";
import { readDraft, writeDraft } from "./hero-draft";

type Reading = { id: string; style: string; content: string; created_at: string; feedback: number | null };
type DreamWithReadings = { id: string; title: string | null; content: string; dreamed_on: string; interpretations: Reading[] };

function today() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function StyleSelect({ value, onChange }: { value: InterpretationStyle; onChange: (s: InterpretationStyle) => void }) {
  const t = useTranslations("journal");
  const s = useTranslations("styles");
  return (
    <div>
      <label htmlFor="style" className={labelClass}>
        {t("styleLabel")}
      </label>
      <select id="style" value={value} onChange={(e) => onChange(e.target.value as InterpretationStyle)} className={fieldClass}>
        {STYLES.map((st) => (
          <option key={st} value={st}>
            {s(st)} — {s(`desc.${st}`)}
          </option>
        ))}
      </select>
    </div>
  );
}

function useInterpret() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("journal");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  async function run(payload: { dreamId?: string; content?: string; dreamedOn?: string; style: InterpretationStyle }) {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, locale }),
      });
      const data = (await res.json().catch(() => ({}))) as { dreamId?: string; error?: string };
      if (payload.content && data.dreamId) writeDraft("");
      if (!res.ok) {
        setError(t(`errors.${data.error === "quota" ? "quota" : data.error === "short" ? "short" : "generic"}`));
      }
      if (data.dreamId) {
        startTransition(() => {
          router.push({ pathname: "/journal", query: { id: data.dreamId! } });
          router.refresh();
        });
      }
    } catch {
      setError(t("errors.generic"));
    } finally {
      setBusy(false);
    }
  }

  return { run, error, pending: pending || busy };
}

export function Composer({ quotaLeft }: { quotaLeft: number }) {
  const t = useTranslations("journal");
  const ref = useRef<HTMLTextAreaElement>(null);
  const [style, setStyle] = useState<InterpretationStyle>("default");
  const { run, error, pending } = useInterpret();

  useEffect(() => {
    const draft = readDraft();
    if (draft && ref.current && !ref.current.value) ref.current.value = draft;
  }, []);

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const content = String(form.get("content") ?? "").trim();
        if (content.length < 10) {
          ref.current?.focus();
          return;
        }
        run({ content, dreamedOn: String(form.get("dreamedOn")), style });
      }}
    >
      <div>
        <label htmlFor="dream-content" className={labelClass}>
          {t("dreamLabel")}
        </label>
        <textarea
          id="dream-content"
          name="content"
          ref={ref}
          rows={9}
          maxLength={8000}
          placeholder={t("placeholder")}
          onChange={(e) => writeDraft(e.target.value)}
          className="ruled block w-full resize-y rounded-xl border border-rule px-4 text-lg focus:border-ultra focus:outline-none"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-[12rem_1fr]">
        <div>
          <label htmlFor="dreamedOn" className={labelClass}>
            {t("dateLabel")}
          </label>
          <input id="dreamedOn" name="dreamedOn" type="date" defaultValue={today()} max={today()} className={fieldClass} />
        </div>
        <StyleSelect value={style} onChange={setStyle} />
      </div>
      {error && (
        <p role="alert" className="font-sans text-sm text-danger">
          {error}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? t("interpreting") : quotaLeft > 0 ? t("interpret") : t("newDream")}
      </Button>
    </form>
  );
}

function Feedback({ reading }: { reading: Reading }) {
  const t = useTranslations("journal");
  const [value, setValue] = useState(reading.feedback);
  const [, startTransition] = useTransition();
  const send = (v: 1 | -1) => {
    setValue(v);
    startTransition(() => setFeedback(reading.id, v));
  };
  return (
    <div className="mt-4 flex items-center gap-3 font-sans text-sm text-slate">
      {value ? (
        <span role="status">{t("thanks")}</span>
      ) : (
        <>
          <span>{t("helpful")}</span>
          <button onClick={() => send(1)} className="rounded-full border border-rule px-3 py-1 hover:border-ink">
            {t("yes")}
          </button>
          <button onClick={() => send(-1)} className="rounded-full border border-rule px-3 py-1 hover:border-ink">
            {t("no")}
          </button>
        </>
      )}
    </div>
  );
}

function DeleteDream({ id }: { id: string }) {
  const t = useTranslations("journal");
  const [confirming, setConfirming] = useState(false);
  if (!confirming) {
    return (
      <button onClick={() => setConfirming(true)} className="font-sans text-sm text-slate underline underline-offset-4 hover:text-danger">
        {t("delete")}
      </button>
    );
  }
  return (
    <form action={deleteDream} className="flex flex-wrap items-center gap-3 rounded-xl border border-danger/40 p-4 font-sans text-sm">
      <input type="hidden" name="id" value={id} />
      <span>{t("deleteConfirm")}</span>
      <Button variant="danger" type="submit" className="!px-4 !py-1.5">
        {t("deleteYes")}
      </Button>
      <button type="button" onClick={() => setConfirming(false)} className="underline underline-offset-4">
        {t("cancel")}
      </button>
    </form>
  );
}

export function DreamView({ dream, dateLabel, quotaLeft }: { dream: DreamWithReadings; dateLabel: string; quotaLeft: number }) {
  const t = useTranslations("journal");
  const s = useTranslations("styles");
  const [style, setStyle] = useState<InterpretationStyle>("jung");
  const { run, error, pending } = useInterpret();
  const readings = dream.interpretations;

  return (
    <article>
      <p className="font-sans text-sm text-slate">{dateLabel}</p>
      <h2 className="mt-1 text-3xl font-medium leading-tight">{dream.title ?? t("dreamLabel")}</h2>
      <blockquote className="ruled mt-5 whitespace-pre-wrap rounded-xl border border-rule px-5 pb-3 text-lg">{dream.content}</blockquote>

      {readings.length > 0 && (
        <section className="mt-10">
          <h3 className="font-sans text-sm font-semibold text-slate">{t("readings")}</h3>
          <ol className="mt-3 space-y-6">
            {readings.map((r) => (
              <li key={r.id} className="rounded-2xl bg-dawn/55 p-6">
                <p className="font-sans text-sm font-medium">{s(r.style as InterpretationStyle)}</p>
                <div className="mt-2 whitespace-pre-wrap">{r.content}</div>
                <Feedback reading={r} />
              </li>
            ))}
          </ol>
        </section>
      )}

      {quotaLeft > 0 && (
        <form
          className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            run({ dreamId: dream.id, style });
          }}
        >
          <StyleSelect value={style} onChange={setStyle} />
          <Button type="submit" disabled={pending}>
            {pending ? t("interpreting") : readings.length ? t("reinterpret") : t("interpret")}
          </Button>
        </form>
      )}
      {error && (
        <p role="alert" className="mt-3 font-sans text-sm text-danger">
          {error}
        </p>
      )}

      <div className="mt-12">
        <DeleteDream id={dream.id} />
      </div>
    </article>
  );
}
