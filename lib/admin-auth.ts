import { createAdminClient } from "./supabase/admin";
import { createClient } from "./supabase/server";
import type { AdminProfile } from "./types";

export async function getCurrentAdminProfile(): Promise<AdminProfile | null> {
  const authClient = await createClient();
  const adminClient = createAdminClient();

  if (!authClient || !adminClient) {
    return null;
  }

  const { data: userData } = await authClient.auth.getUser();
  const user = userData.user;

  if (!user) {
    return null;
  }

  const { data, error } = await adminClient
    .from("profiles")
    .select("id, full_name, role, phone, created_at")
    .eq("id", user.id)
    .in("role", ["super_admin", "admin"])
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    fullName: data.full_name,
    role: data.role,
    phone: data.phone,
    createdAt: data.created_at
  };
}

export async function requireAdmin() {
  return getCurrentAdminProfile();
}

export async function requireSuperAdmin() {
  const profile = await getCurrentAdminProfile();
  return profile?.role === "super_admin" ? profile : null;
}
