"use server";

import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { z } from "zod";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import type { Locale } from "@/i18n/routing";

export type FormState = { error?: string; ok?: boolean; email?: string } | undefined;

/** Only allow in-app relative paths after login. */
function safeNext(value: FormDataEntryValue | null): string {
  const v = typeof value === "string" ? value : "";
  if (!v.startsWith("/") || v.startsWith("//")) return "/journal";
  return v.replace(/^\/(pt|es)(?=\/|$)/, "") || "/journal";
}

const credentials = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = credentials.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "invalid" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "invalid" };

  const locale = (await getLocale()) as Locale;
  redirect({ href: safeNext(formData.get("next")), locale });
}

export async function signup(_: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("terms") !== "on") return { error: "terms" };
  const parsed = credentials.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues.some((i) => i.path[0] === "password") ? "weak" : "invalid" };
  }

  const locale = (await getLocale()) as Locale;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    ...parsed.data,
    options: {
      data: { locale, terms_accepted: true },
      emailRedirectTo: `${env.siteUrl}/auth/confirm?next=${locale === "en" ? "" : `/${locale}`}/journal`,
    },
  });
  if (error) return { error: error.status === 422 ? "weak" : "generic" };

  // With email confirmation enabled there is no session yet.
  if (!data.session) return { ok: true, email: parsed.data.email };
  redirect({ href: "/journal", locale });
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const locale = (await getLocale()) as Locale;
  redirect({ href: "/", locale });
}

const profileSchema = z.object({
  birth_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .or(z.literal(""))
    .transform((v) => v || null),
  locale: z.enum(["en", "pt", "es"]),
  ai_training_opt_in: z.literal("on").optional().transform(Boolean),
});

export async function updateProfile(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "invalid" };

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "generic" };

  const { error } = await supabase.from("profiles").update(parsed.data).eq("id", auth.user.id);
  if (error) return { error: "generic" };
  revalidatePath("/[locale]/account", "page");
  return { ok: true };
}

export async function deleteDream(formData: FormData) {
  const id = z.string().uuid().parse(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("dreams").delete().eq("id", id); // RLS limits this to the owner
  const locale = (await getLocale()) as Locale;
  redirect({ href: "/journal", locale });
}

export async function setFeedback(interpretationId: string, value: 1 | -1) {
  const id = z.string().uuid().parse(interpretationId);
  const supabase = await createClient();
  await supabase.from("interpretations").update({ feedback: value }).eq("id", id);
}

export async function deleteAccount(_: FormState, formData: FormData): Promise<FormState> {
  const expected = String(formData.get("expected") ?? "");
  if (!expected || formData.get("confirm") !== expected) return { error: "confirm" };

  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_my_account");
  if (error) return { error: "generic" };
  await supabase.auth.signOut();
  const locale = (await getLocale()) as Locale;
  redirect({ href: "/", locale });
}
