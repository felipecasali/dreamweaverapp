import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "@/i18n/routing";

const intl = createIntlMiddleware(routing);

const PROTECTED = /^\/(?:(?:pt|es)\/)?(?:journal|account)(?:\/|$)/;

export async function proxy(request: NextRequest) {
  // 1. Locale routing (may redirect or rewrite)
  const response = intl(request);

  // 2. Refresh the Supabase session cookie on the same response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Optimistic gate for app routes; pages re-check on the server.
  const path = request.nextUrl.pathname;
  if (!user && PROTECTED.test(path)) {
    const prefix = path.match(/^\/(pt|es)(?:\/|$)/)?.[1];
    const url = request.nextUrl.clone();
    url.pathname = prefix ? `/${prefix}/login` : "/login";
    url.searchParams.set("next", path);
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }

  return response;
}

export const config = {
  // Skip API routes, Next internals, auth callback and files with extensions
  matcher: ["/((?!api|auth|_next|_vercel|.*\\..*).*)"],
};
