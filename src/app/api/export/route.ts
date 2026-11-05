import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Data portability: everything the user has stored, as a JSON download. */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });

  const [profile, dreams, interpretations] = await Promise.all([
    supabase.from("profiles").select("display_name, birth_date, locale, ai_training_opt_in, plan, terms_accepted_at, created_at").eq("id", user.id).single(),
    supabase.from("dreams").select("id, title, content, dreamed_on, sentiment, created_at, updated_at").order("dreamed_on"),
    supabase.from("interpretations").select("id, dream_id, style, content, model, feedback, created_at").order("created_at"),
  ]);

  const payload = {
    exported_at: new Date().toISOString(),
    account: { email: user.email, created_at: user.created_at },
    profile: profile.data,
    dreams: dreams.data ?? [],
    interpretations: interpretations.data ?? [],
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="dreamweaver-export-${new Date().toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
