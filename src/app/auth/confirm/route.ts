import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";

/**
 * Target of every email link (sign-up confirmation, password recovery).
 *
 * The Supabase client is bound to the redirect response itself, so the session
 * cookies written by the exchange are guaranteed to travel with the redirect.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const linkError = searchParams.get("error_code") ?? searchParams.get("error");

  const nextParam = searchParams.get("next") ?? "/journal";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/journal";
  const localePrefix = next.match(/^\/(pt|es)(?=\/|$)/)?.[0] ?? "";
  const loginUrl = (status: string) => `${origin}${localePrefix}/login?status=${status}`;

  // Supabase sends the user back with an error when the link was already used or expired
  if (linkError) {
    console.error("auth/confirm: link error", linkError);
    return NextResponse.redirect(loginUrl("link-expired"));
  }

  const response = NextResponse.redirect(`${origin}${next}`);
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) =>
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
      },
    },
  );

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return response;
    // The address is already confirmed at this point (Supabase verified the link before
    // redirecting); only the automatic sign-in failed, e.g. the link was opened in
    // another browser. The user can simply log in.
    console.error("auth/confirm: code exchange failed", error.code ?? error.message);
    const failed = NextResponse.redirect(loginUrl(type === "recovery" ? "link-expired" : "confirmed"));
    response.cookies.getAll().forEach((c) => failed.cookies.set(c));
    return failed;
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return response;
    console.error("auth/confirm: token verification failed", error.code ?? error.message);
  }

  return NextResponse.redirect(loginUrl("link-expired"));
}
