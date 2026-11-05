import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getInterpreter, STYLES } from "@/lib/ai";
import { env } from "@/lib/env";

const body = z
  .object({
    dreamId: z.string().uuid().optional(),
    content: z.string().trim().min(10).max(8000).optional(),
    dreamedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    style: z.enum(STYLES),
    locale: z.enum(["en", "pt", "es"]),
  })
  .refine((b) => b.dreamId || b.content, { message: "content required" });

function ageFrom(birthDate: string | null): number | undefined {
  if (!birthDate) return undefined;
  const b = new Date(`${birthDate}T00:00:00Z`);
  const now = new Date();
  let age = now.getUTCFullYear() - b.getUTCFullYear();
  if (now.getUTCMonth() < b.getUTCMonth() || (now.getUTCMonth() === b.getUTCMonth() && now.getUTCDate() < b.getUTCDate())) age--;
  return age > 0 && age < 120 ? age : undefined;
}

export async function POST(request: Request) {
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "short" }, { status: 400 });
  const input = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("plan, birth_date").eq("id", user.id).single();

  // Free-plan quota, counted on the server. Journal entries stay unlimited.
  let quotaReached = false;
  if ((profile?.plan ?? "free") === "free") {
    const { count } = await supabase
      .from("interpretations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    quotaReached = (count ?? 0) >= env.freeInterpretations;
  }

  // Create the dream, or load (and optionally update) an existing one
  let dream: { id: string; content: string; title: string | null };
  if (input.dreamId) {
    const { data, error } = await supabase.from("dreams").select("id, content, title").eq("id", input.dreamId).single();
    if (error || !data) return NextResponse.json({ error: "generic" }, { status: 404 });
    dream = data;
    if (input.content && input.content !== data.content) {
      await supabase.from("dreams").update({ content: input.content }).eq("id", data.id);
      dream.content = input.content;
    }
  } else {
    const { data, error } = await supabase
      .from("dreams")
      .insert({ user_id: user.id, content: input.content!, dreamed_on: input.dreamedOn })
      .select("id, content, title")
      .single();
    if (error || !data) return NextResponse.json({ error: "generic" }, { status: 500 });
    dream = data;
  }

  if (quotaReached) return NextResponse.json({ error: "quota", dreamId: dream.id }, { status: 402 });

  try {
    const result = await getInterpreter().interpret({
      dream: dream.content,
      style: input.style,
      locale: input.locale,
      age: ageFrom(profile?.birth_date ?? null),
    });

    const { data: interpretation, error } = await supabase
      .from("interpretations")
      .insert({
        dream_id: dream.id,
        user_id: user.id,
        style: input.style,
        content: result.body,
        model: result.model,
      })
      .select("id, style, content, created_at, feedback")
      .single();
    if (error) throw error;

    await supabase
      .from("dreams")
      .update({ sentiment: result.sentiment, ...(dream.title ? {} : { title: result.title }) })
      .eq("id", dream.id);

    return NextResponse.json({ dreamId: dream.id, interpretation });
  } catch (err) {
    console.error("interpret failed", err);
    return NextResponse.json({ error: "generic", dreamId: dream.id }, { status: 502 });
  }
}
