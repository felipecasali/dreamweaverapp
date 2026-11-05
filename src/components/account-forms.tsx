"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { deleteAccount, updateProfile, type FormState } from "@/lib/actions";
import { Button, fieldClass, labelClass } from "./ui";

export function ProfileForm({ profile }: { profile: { birth_date: string | null; locale: string; ai_training_opt_in: boolean } }) {
  const t = useTranslations("account");
  const [state, action, pending] = useActionState<FormState, FormData>(updateProfile, undefined);

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="birth_date" className={labelClass}>
          {t("birthDate")}
        </label>
        <input id="birth_date" name="birth_date" type="date" defaultValue={profile.birth_date ?? ""} className={`${fieldClass} max-w-xs`} aria-describedby="birth-help" />
        <p id="birth-help" className="mt-1.5 font-sans text-sm text-slate">
          {t("birthHelp")}
        </p>
      </div>
      <div>
        <label htmlFor="locale" className={labelClass}>
          {t("language")}
        </label>
        <select id="locale" name="locale" defaultValue={profile.locale} className={`${fieldClass} max-w-xs`}>
          <option value="en">English</option>
          <option value="pt">Português</option>
          <option value="es">Español</option>
        </select>
      </div>
      <label className="flex items-start gap-3 font-sans text-sm">
        <input type="checkbox" name="ai_training_opt_in" defaultChecked={profile.ai_training_opt_in} className="mt-1 size-4 accent-[var(--ultra)]" />
        <span>
          {t("aiOptIn")}
          <span className="block text-slate">{t("aiOptInHelp")}</span>
        </span>
      </label>
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={pending}>
          {t("save")}
        </Button>
        {state?.ok && (
          <span role="status" className="font-sans text-sm text-ok">
            {t("saved")}
          </span>
        )}
      </div>
    </form>
  );
}

export function DeleteAccountForm() {
  const t = useTranslations("account");
  const [state, action, pending] = useActionState<FormState, FormData>(deleteAccount, undefined);
  const word = t("deleteWord");

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="expected" value={word} />
      <label htmlFor="confirm" className={labelClass}>
        {t("deleteConfirmLabel")}
      </label>
      <input id="confirm" name="confirm" autoComplete="off" className={`${fieldClass} max-w-xs`} />
      {state?.error && (
        <p role="alert" className="font-sans text-sm text-danger">
          {t("deleteConfirmLabel")}
        </p>
      )}
      <Button variant="danger" type="submit" disabled={pending}>
        {t("deleteCta")}
      </Button>
    </form>
  );
}
