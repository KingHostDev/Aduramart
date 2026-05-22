"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { requireSuperAdmin } from "./admin-auth";
import { isStrongPassword } from "./password";
import { createAdminClient } from "./supabase/admin";
import { createClient } from "./supabase/server";

export async function sendVendorRecoveryOtp(formData: FormData) {
  const supabase = await createClient();

  if (!supabase) {
    redirect("/vendor-recover?error=not-configured");
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    redirect("/vendor-recover?error=email-required");
  }

  const requestHeaders = await headers();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? requestHeaders.get("origin") ?? "http://localhost:3000";
  const redirectTo = `${origin.replace(/\/$/, "")}/vendor-reset`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo
  });

  if (error) {
    const reason = error.message || error.code || "AduraMart could not send the recovery code. Please try again.";
    redirect(`/vendor-recover?error=send-failed&reason=${encodeURIComponent(reason)}`);
  }

  redirect(`/vendor-reset?sent=1&email=${encodeURIComponent(email)}`);
}

export async function resetVendorPasswordWithOtp(formData: FormData) {
  const supabase = await createClient();

  if (!supabase) {
    redirect("/vendor-reset?error=not-configured");
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const token = String(formData.get("token") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !token || !password) {
    redirect("/vendor-reset?error=incomplete");
  }

  if (!isStrongPassword(password)) {
    redirect(`/vendor-reset?error=weak-password&email=${encodeURIComponent(email)}`);
  }

  const { error: verifyError } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "recovery"
  });

  if (verifyError) {
    redirect(`/vendor-reset?error=invalid-code&email=${encodeURIComponent(email)}`);
  }

  const { error: updateError } = await supabase.auth.updateUser({ password });

  if (updateError) {
    redirect(`/vendor-reset?error=update-failed&email=${encodeURIComponent(email)}`);
  }

  await supabase.auth.signOut();
  redirect("/vendor-login?recovered=1");
}
export async function submitContactMessage(formData: FormData) {
  const adminClient = createAdminClient();

  if (!adminClient) {
    redirect("/messages?sent=not-configured");
  }

  const senderEmail = String(formData.get("senderEmail") ?? "").trim().toLowerCase();
  const senderName = String(formData.get("senderName") ?? "").trim();
  const recipientType = String(formData.get("recipientType") ?? "admin") === "vendor" ? "vendor" : "admin";
  const recipientId = String(formData.get("recipientId") ?? "").trim() || null;
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!senderEmail || !subject || body.length < 10) {
    redirect(`/messages?to=${recipientType}&sent=incomplete`);
  }

  const { error } = await adminClient.from("messages").insert({
    sender_email: senderEmail,
    sender_name: senderName,
    recipient_type: recipientType,
    recipient_id: recipientId,
    subject,
    body
  });

  if (error) {
    redirect(`/messages?to=${recipientType}&sent=failed`);
  }

  redirect(`/messages?to=${recipientType}&sent=1`);
}
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

  const selectedCategories = formData.getAll("category").map((value) => String(value).trim()).filter(Boolean);

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
    category: selectedCategories.length ? selectedCategories.join(", ") : "Worship Materials",
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


export async function updateVendorProfile(formData: FormData) {
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
  const { data: vendor } = await adminClient
    .from("vendors")
    .select("id, user_id, status")
    .eq("id", vendorId)
    .eq("user_id", user.id)
    .single();

  if (!vendor) {
    redirect("/vendor/dashboard?profile=not-authorized");
  }

  if (vendor.status === "suspended") {
    redirect("/vendor/dashboard?profile=suspended");
  }

  const selectedCategories = formData.getAll("category").map((value) => String(value).trim()).filter(Boolean);

  const { error } = await adminClient
    .from("vendors")
    .update({
      owner_name: String(formData.get("ownerName") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      whatsapp: String(formData.get("whatsapp") ?? "").trim(),
      category: selectedCategories.join(", "),
      address: String(formData.get("address") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      state: String(formData.get("state") ?? "").trim(),
      country: String(formData.get("country") ?? "Nigeria").trim(),
      location: String(formData.get("location") ?? "Nigeria").trim(),
      description: String(formData.get("description") ?? "").trim()
    })
    .eq("id", vendorId);

  if (error) {
    redirect("/vendor/dashboard?profile=update-failed");
  }

  redirect("/vendor/dashboard?profile=updated");
}

export async function updateVendorPaymentSettings(formData: FormData) {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  if (!supabase || !adminClient) {
    redirect("/vendor/dashboard?payments=not-configured");
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    redirect("/vendor-login?error=login-required");
  }

  const vendorId = String(formData.get("vendorId") ?? "");
  const { data: vendor } = await adminClient
    .from("vendors")
    .select("id, user_id")
    .eq("id", vendorId)
    .eq("user_id", user.id)
    .single();

  if (!vendor) {
    redirect("/vendor/dashboard?payments=not-authorized");
  }

  const { error } = await adminClient
    .from("vendors")
    .update({
      payment_bank_name: String(formData.get("bankName") ?? "").trim(),
      payment_account_name: String(formData.get("accountName") ?? "").trim(),
      payment_account_number: String(formData.get("accountNumber") ?? "").trim()
    })
    .eq("id", vendorId);

  if (error) {
    redirect("/vendor/dashboard?payments=update-failed");
  }

  redirect("/vendor/dashboard?payments=updated");
}

export async function updateVendorStoreNameByAdmin(formData: FormData) {
  const currentAdmin = await requireSuperAdmin();
  const adminClient = createAdminClient();

  if (!currentAdmin || !adminClient) {
    redirect("/admin/vendors?error=super-admin-required");
  }

  const vendorId = String(formData.get("vendorId") ?? "");
  const storeName = String(formData.get("storeName") ?? "").trim();

  if (!vendorId || storeName.length < 2) {
    redirect(`/admin/vendors/${vendorId}?store-name=incomplete`);
  }

  const { error } = await adminClient.from("vendors").update({ store_name: storeName }).eq("id", vendorId);

  if (error) {
    redirect(`/admin/vendors/${vendorId}?store-name=failed`);
  }

  redirect(`/admin/vendors/${vendorId}?store-name=updated`);
}
export async function deleteVendorAccount(formData: FormData) {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  if (!supabase || !adminClient) {
    redirect("/vendor/dashboard?account=not-configured");
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    redirect("/vendor-login?error=login-required");
  }

  const vendorId = String(formData.get("vendorId") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "").trim().toUpperCase();

  if (confirmation !== "DELETE") {
    redirect("/vendor/dashboard?account=confirm-delete");
  }

  const { data: vendor } = await adminClient
    .from("vendors")
    .select("id, user_id")
    .eq("id", vendorId)
    .eq("user_id", user.id)
    .single();

  if (!vendor) {
    redirect("/vendor/dashboard?account=not-authorized");
  }

  await adminClient.from("vendor_likes").delete().eq("vendor_id", vendorId);
  await adminClient.from("products").delete().eq("vendor_id", vendorId);
  const { error: vendorError } = await adminClient.from("vendors").delete().eq("id", vendorId);

  if (vendorError) {
    redirect("/vendor/dashboard?account=delete-failed");
  }

  await adminClient.from("profiles").delete().eq("id", user.id);
  await adminClient.auth.admin.deleteUser(user.id);
  await supabase.auth.signOut();
  redirect("/vendor-login?deleted=1");
}
export async function removeVendorProduct(formData: FormData) {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  if (!supabase || !adminClient) {
    redirect("/vendor/dashboard/products?product=not-configured");
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    redirect("/vendor-login?error=login-required");
  }

  const productId = String(formData.get("productId") ?? "");

  if (!productId) {
    redirect("/vendor/dashboard?product=remove-failed");
  }

  const { data: product } = await adminClient
    .from("products")
    .select("id, vendor_id, status, vendors!inner(user_id)")
    .eq("id", productId)
    .eq("vendors.user_id", user.id)
    .single();

  if (!product) {
    redirect("/vendor/dashboard/products?product=not-authorized");
  }

  const status = String(product.status);
  const removableStatuses = ["pending", "rejected", "hidden", "suspended"];

  if (removableStatuses.includes(status)) {
    const { error } = await adminClient.from("products").delete().eq("id", productId);

    if (error) {
      redirect("/vendor/dashboard?product=remove-failed");
    }

    redirect("/vendor/dashboard?product=removed");
  }

  const { error } = await adminClient
    .from("products")
    .update({ status: "hidden", featured: false })
    .eq("id", productId);

  if (error) {
    redirect("/vendor/dashboard?product=remove-failed");
  }

  redirect("/vendor/dashboard?product=hidden");
}


export async function markVendorProductOutOfSale(formData: FormData) {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  if (!supabase || !adminClient) {
    redirect("/vendor/dashboard/products?product=not-configured");
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    redirect("/vendor-login?error=login-required");
  }

  const productId = String(formData.get("productId") ?? "");

  const { data: product } = await adminClient
    .from("products")
    .select("id, vendors!inner(user_id)")
    .eq("id", productId)
    .eq("vendors.user_id", user.id)
    .single();

  if (!product) {
    redirect("/vendor/dashboard/products?product=not-authorized");
  }

  const { error } = await adminClient
    .from("products")
    .update({ status: "hidden", stock: 0, featured: false })
    .eq("id", productId);

  if (error) {
    redirect("/vendor/dashboard?product=out-of-sale-failed");
  }

  redirect("/vendor/dashboard?product=out-of-sale");
}

export async function updateVendorProductForReview(formData: FormData) {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  if (!supabase || !adminClient) {
    redirect("/vendor/dashboard/products/new?product=not-configured");
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    redirect("/vendor-login?error=login-required");
  }

  const productId = String(formData.get("productId") ?? "");
  const { data: product } = await adminClient
    .from("products")
    .select("id, vendor_id, image_url, image_urls, vendors!inner(user_id,status)")
    .eq("id", productId)
    .eq("vendors.user_id", user.id)
    .single();

  if (!product) {
    redirect("/vendor/dashboard/products/new?product=not-authorized");
  }

  const relatedVendors = product.vendors as { status?: string } | { status?: string }[] | null;
  const vendorStatus = Array.isArray(relatedVendors) ? relatedVendors[0]?.status : relatedVendors?.status;

  if (vendorStatus !== "approved") {
    redirect("/vendor/dashboard/products/new?product=vendor-not-approved");
  }

  const submittedFiles = formData.getAll("images");

  if (submittedFiles.filter(isUploadableFile).length > 5) {
    redirect(`/vendor/products/${productId}/edit?error=max-5-images`);
  }

  const uploadedImages = await uploadFiles("product-images", submittedFiles, product.vendor_id || "vendor");
  const existingImages = [
    ...(((product as { image_urls?: string[] | null }).image_urls ?? [])),
    product.image_url
  ].filter((image): image is string => Boolean(image));
  const nextImages = uploadedImages.length ? uploadedImages : Array.from(new Set(existingImages));
  const nextImage = nextImages[0];

  if (!nextImage) {
    redirect(`/vendor/products/${productId}/edit?error=image-required`);
  }

  const updatePayload = {
    name: String(formData.get("name") ?? "").trim(),
    category: String(formData.get("category") ?? ""),
    price: Number(formData.get("price") ?? 0),
    stock: Number(formData.get("stock") ?? 0),
    description: String(formData.get("description") ?? "").trim(),
    image_url: nextImage,
    image_urls: nextImages,
    status: "pending",
    featured: false
  };

  const { error } = await adminClient
    .from("products")
    .update(updatePayload)
    .eq("id", productId);

  if (error) {
    const missingGalleryColumn = error.message.toLowerCase().includes("image_urls");

    if (!missingGalleryColumn) {
      redirect(`/vendor/products/${productId}/edit?error=update-failed`);
    }

    const { error: fallbackError } = await adminClient
      .from("products")
      .update({ ...updatePayload, image_urls: undefined })
      .eq("id", productId);

    if (fallbackError) {
      redirect(`/vendor/products/${productId}/edit?error=update-failed`);
    }
  }

  redirect("/vendor/dashboard?product=resubmitted");
}

export async function submitProductForReview(formData: FormData) {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  if (!supabase || !adminClient) {
    redirect("/vendor/dashboard/products/new?product=not-configured");
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    redirect("/vendor-login?error=login-required");
  }

  const vendorId = String(formData.get("vendorId") ?? "");
  const { data: vendor } = await adminClient
    .from("vendors")
    .select("id, status, user_id")
    .eq("id", vendorId)
    .eq("user_id", user.id)
    .single();

  if (!vendor) {
    redirect("/vendor/dashboard/products/new?product=not-authorized");
  }

  if (vendor.status !== "approved") {
    redirect("/vendor/dashboard/products/new?product=vendor-not-approved");
  }

  const submittedFiles = formData.getAll("images");
  const fileCount = submittedFiles.filter(isUploadableFile).length;

  if (fileCount === 0) {
    redirect("/vendor/dashboard/products/new?product=image-required");
  }

  if (fileCount > 5) {
    redirect("/vendor/dashboard/products/new?product=max-5-images");
  }

  const imageUrls = await uploadFiles("product-images", submittedFiles, vendorId || "vendor");
  const imageUrl = imageUrls[0];

  if (!imageUrl) {
    redirect("/vendor/dashboard/products/new?product=upload-failed");
  }

  const productPayload = {
    vendor_id: vendorId,
    name: String(formData.get("name") ?? ""),
    category: String(formData.get("category") ?? ""),
    price: Number(formData.get("price") ?? 0),
    description: String(formData.get("description") ?? ""),
    stock: Number(formData.get("stock") ?? 0),
    image_url: imageUrl,
    image_urls: imageUrls,
    status: "pending",
    featured: false
  };

  const { error } = await adminClient.from("products").insert(productPayload);

  if (error) {
    const missingGalleryColumn = error.message.toLowerCase().includes("image_urls");

    if (!missingGalleryColumn) {
      redirect("/vendor/dashboard/products/new?product=submit-failed");
    }

    const { error: fallbackError } = await adminClient.from("products").insert({ ...productPayload, image_urls: undefined });

    if (fallbackError) {
      redirect("/vendor/dashboard/products/new?product=submit-failed");
    }
  }

  redirect("/vendor/dashboard/products?product=pending-review");
}


type UploadableFile = FormDataEntryValue & {
  arrayBuffer: () => Promise<ArrayBuffer>;
  name?: string;
  size?: number;
  type?: string;
};

function isUploadableFile(value: FormDataEntryValue | null): value is UploadableFile {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<UploadableFile>;
  return typeof candidate.arrayBuffer === "function" && typeof candidate.size === "number" && candidate.size > 0;
}

async function uploadFiles(bucket: string, values: FormDataEntryValue[], owner: string) {
  const files = values.filter(isUploadableFile).slice(0, 5);
  const uploaded = await Promise.all(files.map((file) => uploadFile(bucket, file, owner)));
  return uploaded.filter((url): url is string => Boolean(url));
}
async function uploadFile(bucket: string, value: FormDataEntryValue | null, owner: string) {
  const supabase = createAdminClient() ?? await createClient();
  if (!supabase || !isUploadableFile(value)) {
    return null;
  }

  try {
    const safeOwner = owner.replace(/[^a-z0-9]/gi, "-").toLowerCase();
    const safeName = (value.name || "product-image").replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
    const path = `${safeOwner}/${Date.now()}-${safeName}`;
    const bytes = await value.arrayBuffer();
    const { error } = await supabase.storage.from(bucket).upload(path, bytes, {
      upsert: false,
      contentType: value.type || "application/octet-stream"
    });

    if (error) {
      return null;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  } catch {
    return null;
  }
}