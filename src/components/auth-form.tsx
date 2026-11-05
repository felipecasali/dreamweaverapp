"use client";

import { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { login, signup, type FormState } from "@/lib/actions";
import { Button, fieldClass, labelClass } from "./ui";
import { readDraft } from "./hero-draft";

export function AuthForm({ mode, next }: { mode: "login" | "signup"; next?: string }) {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState<FormState, FormData>(mode === "login" ? login : signup, undefined);
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser-only storage after hydration
    setHasDraft(readDraft().trim().length > 0);
  }, []);

  if (state?.ok && state.email) {
    return (
      <p role="status" className="rounded-xl bg-dawn/60 p-5">
        {t("checkEmail", { email: state.email })}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      {hasDraft && <p className="rounded-xl bg-dawn/60 p-4 font-sans text-sm">{t("draftKept")}</p>}
      <input type="hidden" name="next" value={next ?? "/journal"} />
      <div>
        <label htmlFor="email" className={labelClass}>
          {t("email")}
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className={fieldClass} />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>
          {t("password")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={8}
          required
          aria-describedby={mode === "signup" ? "password-help" : undefined}
          className={fieldClass}
        />
        {mode === "signup" && (
          <p id="password-help" className="mt-1.5 font-sans text-sm text-slate">
            {t("passwordHelp")}
          </p>
        )}
      </div>

      {mode === "signup" && (
        <label className="flex items-start gap-3 font-sans text-sm">
          <input type="checkbox" name="terms" required className="mt-1 size-4 accent-[var(--ultra)]" />
          <span>
            {t.rich("acceptTerms", {
              terms: (chunks) => (
                <Link href="/terms" className="text-ultra underline underline-offset-2" target="_blank">
                  {chunks}
                </Link>
              ),
              privacy: (chunks) => (
                <Link href="/privacy" className="text-ultra underline underline-offset-2" target="_blank">
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </label>
      )}

      {state?.error && (
        <p role="alert" className="font-sans text-sm text-danger">
          {t(`errors.${state.error}` as "errors.generic")}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {mode === "login" ? t("loginCta") : t("signupCta")}
      </Button>

      <p className="text-center font-sans text-sm text-slate">
        {mode === "login" ? t("toSignup") : t("toLogin")}{" "}
        <Link href={mode === "login" ? "/signup" : "/login"} className="text-ultra underline underline-offset-2">
          {mode === "login" ? t("toSignupLink") : t("toLoginLink")}
        </Link>
      </p>
    </form>
  );
}
