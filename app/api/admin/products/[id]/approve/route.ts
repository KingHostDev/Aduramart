import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase service role is not configured." }, { status: 500 });
  }

  const { error } = await supabase
    .from("products")
    .update({ status: "approved" })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
