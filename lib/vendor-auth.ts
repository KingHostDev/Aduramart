import { redirect } from "next/navigation";
import { getVendorByUserId } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

export async function requireVendorDashboard() {
  const supabase = await createClient();

  if (!supabase) {
    redirect("/vendor-login?error=not-configured");
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    redirect("/vendor-login?error=login-required");
  }

  const vendor = await getVendorByUserId(user.id);

  if (!vendor) {
    redirect("/vendor/onboarding");
  }

  return { vendor, user };
}