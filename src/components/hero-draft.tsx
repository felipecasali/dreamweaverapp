"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import { buttonClass } from "./ui";

export const DRAFT_KEY = "dw:draft";

export function readDraft(): string {
  try {
    return window.localStorage.getItem(DRAFT_KEY) ?? "";
  } catch {
    return "";
  }
}

export function writeDraft(value: string) {
  try {
    if (value) window.localStorage.setItem(DRAFT_KEY, value);
    else window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* storage unavailable */
  }
}

/**
 * The hero's writing field. Nothing is sent anywhere from here: the text is kept on
 * this device and picked up by the journal after sign-up or log-in.
 */
export function HeroDraft({
  placeholder,
  cta,
  note,
  label,
  signedIn,
}: {
  placeholder: string;
  cta: string;
  note: string;
  label: string;
  signedIn: boolean;
}) {
  const router = useRouter();
  const ref = useRef<HTMLTextAreaElement>(null);

  // Restore an unfinished draft after the page has hydrated
  useEffect(() => {
    const saved = readDraft();
    if (saved && ref.current && !ref.current.value) ref.current.value = saved;
  }, []);

  return (
    <form
      className="rise mt-10 rounded-2xl border border-rule bg-paper p-2 shadow-[0_30px_60px_-30px_rgba(18,26,48,0.45)] [animation-delay:150ms]"
      onSubmit={(e) => {
        e.preventDefault();
        const value = ref.current?.value.trim() ?? "";
        if (value.length < 10) {
          ref.current?.focus();
          return;
        }
        writeDraft(value);
        router.push(signedIn ? "/journal?draft=1" : "/signup?draft=1");
      }}
    >
      <label htmlFor="hero-dream" className="sr-only">
        {label}
      </label>
      <textarea
        id="hero-dream"
        ref={ref}
        onChange={(e) => writeDraft(e.target.value)}
        placeholder={placeholder}
        rows={6}
        minLength={10}
        className="ruled block w-full resize-y rounded-xl px-4 text-lg text-ink placeholder:italic placeholder:text-slate/80 focus:outline-none"
      />
      <div className="flex flex-col items-start gap-3 px-3 pb-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-sm text-slate">{note}</p>
        <button type="submit" className={buttonClass("primary", "shrink-0")}>
          {cta}
        </button>
      </div>
    </form>
  );
}
