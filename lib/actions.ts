"use server";

import { redirect } from "next/navigation";
import { requireSuperAdmin } from "./admin-auth";
import { createAdminClient } from "./supabase/admin";
import { createClient } from "./supabase/server";

export async function loginAdmin(formData: FormData) {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  if (!supabase || !adminClient) {
    redirect("/admin?error=not-configured");
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    const reason = error?.code ?? error?.message?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ?? "invalid-login";
    redirect(`/admin?error=${encodeURIComponent(reason)}`);
  }

  const { data: profile } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .in("role", ["super_admin", "admin"])
    .single();

  if (!profile) {
    await supabase.auth.signOut();
    redirect("/admin?error=unauthorized");
  }

  redirect("/admin/dashboard");
}

export async function loginVendor(formData: FormData) {
  const supabase = await createClient();

  if (!supabase) {
    redirect("/vendor-login?error=not-configured");
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const reason = error.code ?? error.message?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ?? "invalid-login";
    redirect(`/vendor-login?error=${encodeURIComponent(reason)}`);
  }

  redirect("/vendor/dashboard");
}

export async function logout() {
  const supabase = await createClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/");
}

export async function createAdminAccount(formData: FormData) {
  const currentAdmin = await requireSuperAdmin();
  const supabase = createAdminClient();

  if (!currentAdmin || !supabase) {
    redirect("/admin/team?error=super-admin-required");
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "admin") === "super_admin" ? "super_admin" : "admin";

  if (!fullName || !email || !password) {
    redirect("/admin/team?error=incomplete");
  }

  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role
    },
    app_metadata: {
      role
    }
  });

  if (userError || !userData.user) {
    redirect("/admin/team?error=create-failed");
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: userData.user.id,
    full_name: fullName,
    role,
    phone
  });

  if (profileError) {
    redirect("/admin/team?error=profile-failed");
  }

  redirect("/admin/team?created=1");
}

export async function registerVendor(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) {
    redirect("/vendor/onboarding?submitted=not-configured");
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const { data: authData } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: String(formData.get("ownerName") ?? ""),
        role: "vendor"
      }
    }
  });

  const [governmentIdUrl, selfieUrl, bannerUrl, logoUrl] = await Promise.all([
    uploadFile("vendor-government-ids", formData.get("governmentId"), email),
    uploadFile("vendor-selfies", formData.get("selfie"), email),
    uploadFile("vendor-banners", formData.get("banner"), email),
    uploadFile("vendor-logos", formData.get("logo"), email)
  ]);

  const payload = {
    owner_name: String(formData.get("ownerName") ?? ""),
    store_name: String(formData.get("storeName") ?? ""),
    email,
    phone: String(formData.get("phone") ?? ""),
    category: String(formData.get("category") ?? "Worship Materials"),
    location: String(formData.get("location") ?? "Nigeria"),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    description: String(formData.get("description") ?? ""),
    user_id: authData.user?.id,
    government_id_url: governmentIdUrl,
    selfie_url: selfieUrl,
    banner_url: bannerUrl,
    logo_url: logoUrl,
    status: "pending",
    verified: false
  };

  await supabase.from("vendors").insert(payload);
  redirect("/vendor/onboarding?submitted=review");
}


export async function updateVendorBio(formData: FormData) {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  if (!supabase || !adminClient) {
    redirect("/vendor/dashboard?profile=not-configured");
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    redirect("/vendor-login?error=login-required");
  }

  const vendorId = String(formData.get("vendorId") ?? "");
  const description = String(formData.get("description") ?? "").trim();

  if (!vendorId || description.length < 20) {
    redirect("/vendor/dashboard?profile=bio-too-short");
  }

  const { data: vendor } = await adminClient
    .from("vendors")
    .select("id, user_id")
    .eq("id", vendorId)
    .eq("user_id", user.id)
    .single();

  if (!vendor) {
    redirect("/vendor/dashboard?profile=not-authorized");
  }

  const { error } = await adminClient
    .from("vendors")
    .update({ description })
    .eq("id", vendorId);

  if (error) {
    redirect("/vendor/dashboard?profile=update-failed");
  }

  redirect("/vendor/dashboard?profile=updated");
}

export async function submitProductForReview(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) {
    redirect("/vendor/dashboard?product=pending");
  }

  const vendorId = String(formData.get("vendorId") ?? "");
  const { data: vendor } = await supabase.from("vendors").select("status").eq("id", vendorId).single();

  if (vendor?.status !== "approved") {
    redirect("/vendor/dashboard?product=vendor-not-approved");
  }

  const imageUrl = await uploadFile("product-images", formData.get("image"), vendorId || "vendor");

  if (!imageUrl) {
    redirect("/vendor/dashboard?product=image-required");
  }

  const { error } = await supabase.from("products").insert({
    vendor_id: vendorId,
    name: String(formData.get("name") ?? ""),
    category: String(formData.get("category") ?? ""),
    price: Number(formData.get("price") ?? 0),
    description: String(formData.get("description") ?? ""),
    stock: Number(formData.get("stock") ?? 0),
    image_url: imageUrl,
    status: "pending",
    featured: false
  });

  if (error) {
    redirect("/vendor/dashboard?product=submit-failed");
  }

  redirect("/vendor/dashboard?product=pending-review");
}

async function uploadFile(bucket: string, value: FormDataEntryValue | null, owner: string) {
  const supabase = await createClient();
  if (!supabase || !(value instanceof File) || value.size === 0) {
    return null;
  }

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
