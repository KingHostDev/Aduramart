import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createAdminClient();
  const authClient = await createClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase service role is not configured." }, { status: 500 });
  }

  const formData = await request.formData();
  const activeUser = authClient ? (await authClient.auth.getUser()).data.user : null;
  const email = String(formData.get("email") ?? activeUser?.email ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const ownerName = String(formData.get("ownerName") ?? activeUser?.user_metadata?.full_name ?? activeUser?.user_metadata?.name ?? "").trim();

  if (!email || !ownerName || (!activeUser && !password)) {
    return NextResponse.json({ error: "Personal information is incomplete." }, { status: 400 });
  }

  if (formData.get("termsAccepted") !== "on") {
    return NextResponse.json({ error: "Please accept AduraMart vendor terms before submitting." }, { status: 400 });
  }

  let userId = activeUser?.id ?? null;

  if (!userId) {
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

    userId = authData.user?.id ?? null;
  }

  if (userId) {
    await supabase.from("profiles").upsert({
      id: userId,
      full_name: ownerName,
      role: "vendor",
      phone: String(formData.get("phone") ?? "").trim()
    });
  }

  const [governmentIdUrl, selfieUrl, bannerUrl, logoUrl] = await Promise.all([
    uploadFile(supabase, "vendor-government-ids", formData.get("governmentId"), email),
    uploadFile(supabase, "vendor-selfies", formData.get("selfie"), email),
    uploadFile(supabase, "vendor-banners", formData.get("banner"), email),
    uploadFile(supabase, "vendor-logos", formData.get("logo"), email)
  ]);

  const selectedCategories = formData.getAll("category").map((value) => String(value).trim()).filter(Boolean);
  const city = String(formData.get("city") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  const country = String(formData.get("country") ?? "Nigeria").trim();
  const smileConfigured = Boolean(process.env.SMILE_ID_PARTNER_ID && process.env.SMILE_ID_API_KEY);

  const baseVendorPayload = {
    user_id: userId,
    owner_name: ownerName,
    store_name: String(formData.get("storeName") ?? "").trim(),
    email,
    phone: String(formData.get("phone") ?? "").trim(),
    category: selectedCategories.length ? selectedCategories.join(", ") : "Worship Materials",
    location: [city, state, country].filter(Boolean).join(", ") || "Nigeria",
    address: String(formData.get("address") ?? "").trim(),
    city,
    state,
    country,
    whatsapp: String(formData.get("whatsapp") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    government_id_url: governmentIdUrl,
    selfie_url: selfieUrl,
    banner_url: bannerUrl,
    logo_url: logoUrl,
    status: "pending",
    verified: false
  };

  const kycVendorPayload = {
    ...baseVendorPayload,
    id_type: String(formData.get("idType") ?? "").trim(),
    id_number: String(formData.get("idNumber") ?? "").trim(),
    date_of_birth: String(formData.get("dateOfBirth") ?? "").trim(),
    kyc_status: smileConfigured ? "pending" : "not_configured",
    kyc_provider: "smile_id"
  };

  const { error: vendorError } = await supabase.from("vendors").insert(kycVendorPayload);

  if (vendorError) {
    const message = vendorError.message.toLowerCase();
    const missingKycColumns = ["id_type", "id_number", "date_of_birth", "kyc_status", "kyc_provider"].some((column) => message.includes(column));

    if (!missingKycColumns) {
      return NextResponse.json({ error: vendorError.message }, { status: 400 });
    }

    const { error: fallbackError } = await supabase.from("vendors").insert(baseVendorPayload);

    if (fallbackError) {
      return NextResponse.json({ error: fallbackError.message }, { status: 400 });
    }
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
