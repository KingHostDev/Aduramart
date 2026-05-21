import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireSuperAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Only a Super Admin can permanently delete vendor accounts." }, { status: 403 });
  }

  const supabase = createAdminClient();
  const { id } = await params;

  if (!supabase) {
    return NextResponse.json({ error: "Supabase service role is not configured." }, { status: 500 });
  }

  const { data: vendor } = await supabase
    .from("vendors")
    .select("id, user_id")
    .eq("id", id)
    .single();

  if (!vendor) {
    return NextResponse.json({ error: "Vendor not found." }, { status: 404 });
  }

  await supabase.from("vendor_likes").delete().eq("vendor_id", id);
  await supabase.from("products").delete().eq("vendor_id", id);
  const { error: vendorError } = await supabase.from("vendors").delete().eq("id", id);

  if (vendorError) {
    return NextResponse.json({ error: vendorError.message }, { status: 400 });
  }

  if (vendor.user_id) {
    await supabase.from("profiles").delete().eq("id", vendor.user_id);
    await supabase.auth.admin.deleteUser(vendor.user_id);
  }

  return NextResponse.json({ ok: true });
}
