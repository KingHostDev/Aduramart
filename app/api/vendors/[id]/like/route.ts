import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createAdminClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase service role is not configured." }, { status: 500 });
  }

  const { id: vendorId } = await params;
  const body = await request.json().catch(() => null) as { visitorKey?: string; shouldLike?: boolean } | null;
  const visitorKey = String(body?.visitorKey ?? "").trim();
  const shouldLike = body?.shouldLike === true;

  if (!vendorId || visitorKey.length < 8) {
    return NextResponse.json({ error: "Invalid vendor like request." }, { status: 400 });
  }

  const { data: vendor } = await supabase
    .from("vendors")
    .select("id, status")
    .eq("id", vendorId)
    .eq("status", "approved")
    .single();

  if (!vendor) {
    return NextResponse.json({ error: "Vendor is not available for likes." }, { status: 404 });
  }

  if (shouldLike) {
    const { error } = await supabase
      .from("vendor_likes")
      .upsert({ vendor_id: vendorId, visitor_key: visitorKey }, { onConflict: "vendor_id,visitor_key" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  } else {
    const { error } = await supabase
      .from("vendor_likes")
      .delete()
      .eq("vendor_id", vendorId)
      .eq("visitor_key", visitorKey);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  const { count } = await supabase
    .from("vendor_likes")
    .select("id", { count: "exact", head: true })
    .eq("vendor_id", vendorId);

  const likes = count ?? 0;
  await supabase.from("vendors").update({ likes_count: likes }).eq("id", vendorId);

  return NextResponse.json({ liked: shouldLike, likes });
}