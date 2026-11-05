import { type NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/** Email confirmation link target (token_hash flow, works with server-side sessions). */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const nextParam = searchParams.get("next") ?? "/journal";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/journal";

  const code = searchParams.get("code");
  const supabase = await createClient();

  if (code) {
    // Default Supabase flow (PKCE): the confirmation email lands here with ?code=
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  } else if (tokenHash && type) {
    // Custom email template using {{ .TokenHash }}
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/login?error=confirm`);
}
