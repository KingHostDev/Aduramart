"use server";

import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

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
