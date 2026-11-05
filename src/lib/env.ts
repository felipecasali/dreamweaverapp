function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

export const env = {
  get supabaseUrl() {
    return required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
  },
  get supabaseKey() {
    return required("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  },
  get siteUrl() {
    return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://dreamweaverapp.com").replace(/\/$/, "");
  },
  /** Free interpretations before a supporter plan is needed. */
  freeInterpretations: Number(process.env.FREE_INTERPRETATIONS ?? 3),
};
