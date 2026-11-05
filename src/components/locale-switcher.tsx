"use client";

import { useParams } from "next/navigation";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const NAMES: Record<Locale, string> = { en: "English", pt: "Português", es: "Español" };

export function LocaleSwitcher({ current, label }: { current: Locale; label: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [pending, startTransition] = useTransition();

  return (
    <label className="relative font-sans text-sm text-slate">
      <span className="sr-only">{label}</span>
      <select
        value={current}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as Locale;
          startTransition(() => {
            // @ts-expect-error -- params are forwarded unchanged for dynamic routes
            router.replace({ pathname, params }, { locale: next });
          });
        }}
        className="cursor-pointer appearance-none rounded-full border border-rule bg-transparent py-1.5 pl-3 pr-7 text-ink hover:border-ink"
      >
        {(Object.keys(NAMES) as Locale[]).map((l) => (
          <option key={l} value={l}>
            {NAMES[l]}
          </option>
        ))}
      </select>
      <span aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs">
        ▾
      </span>
    </label>
  );
}
