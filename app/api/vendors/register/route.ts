import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = createAdminClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase service role is not configured." }, { status: 500 });
  }

  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const ownerName = String(formData.get("ownerName") ?? "").trim();

  if (!email || !password || !ownerName) {
    return NextResponse.json({ error: "Personal information is incomplete." }, { status: 400 });
  }

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: ownerName,
      role: "vendor"
    },
    app_metadata: {
      role: "vendor"
    }
  });

  if (authError && !authError.message.toLowerCase().includes("already")) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const userId = authData.user?.id ?? null;
  const [governmentIdUrl, selfieUrl, bannerUrl, logoUrl] = await Promise.all([
    uploadFile(supabase, "vendor-government-ids", formData.get("governmentId"), email),
    uploadFile(supabase, "vendor-selfies", formData.get("selfie"), email),
    uploadFile(supabase, "vendor-banners", formData.get("banner"), email),
    uploadFile(supabase, "vendor-logos", formData.get("logo"), email)
  ]);

  const { error: vendorError } = await supabase.from("vendors").insert({
    user_id: userId,
    owner_name: ownerName,
    store_name: String(formData.get("storeName") ?? "").trim(),
    email,
    phone: String(formData.get("phone") ?? "").trim(),
    category: String(formData.get("category") ?? "Worship Materials"),
    location: String(formData.get("location") ?? "Nigeria").trim(),
    whatsapp: String(formData.get("whatsapp") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    government_id_url: governmentIdUrl,
    selfie_url: selfieUrl,
    banner_url: bannerUrl,
    logo_url: logoUrl,
    status: "pending",
    verified: false
  });

  if (vendorError) {
    return NextResponse.json({ error: vendorError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

async function uploadFile(
  supabase: NonNullable<ReturnType<typeof createAdminClient>>,
  bucket: string,
  value: FormDataEntryValue | null,
  owner: string
) {
  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  await supabase.storage.createBucket(bucket, {
    public: bucket === "vendor-banners" || bucket === "vendor-logos"
  });

  const safeOwner = owner.replace(/[^a-z0-9]/gi, "-").toLowerCase();
  const path = `${safeOwner}/${Date.now()}-${value.name}`;
  const { error } = await supabase.storage.from(bucket).upload(path, value, {
    upsert: false,
    contentType: value.type
  });

  if (error) {
    return null;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
