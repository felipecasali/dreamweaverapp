"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { requestPasswordReset, updatePassword, type FormState } from "@/lib/actions";
import { Button, fieldClass, labelClass } from "./ui";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState<FormState, FormData>(requestPasswordReset, undefined);

  if (state?.ok && state.email) {
    return (
      <p role="status" className="rounded-xl bg-dawn/60 p-5">
        {t("forgotSent", { email: state.email })}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      <div>
        <label htmlFor="email" className={labelClass}>
          {t("email")}
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className={fieldClass} />
      </div>
      {state?.error && (
        <p role="alert" className="font-sans text-sm text-danger">
          {t(`errors.${state.error}` as "errors.generic")}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {t("forgotCta")}
      </Button>
      <p className="text-center font-sans text-sm">
        <Link href="/login" className="text-ultra underline underline-offset-2">
          {t("loginCta")}
        </Link>
      </p>
    </form>
  );
}

export function ResetPasswordForm() {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState<FormState, FormData>(updatePassword, undefined);

  return (
    <form action={action} className="space-y-5" noValidate>
      <div>
        <label htmlFor="password" className={labelClass}>
          {t("newPassword")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          aria-describedby="password-help"
          className={fieldClass}
        />
        <p id="password-help" className="mt-1.5 font-sans text-sm text-slate">
          {t("passwordHelp")}
        </p>
      </div>
      {state?.error && (
        <p role="alert" className="font-sans text-sm text-danger">
          {t(`errors.${state.error}` as "errors.generic")}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {t("resetCta")}
      </Button>
    </form>
  );
}
