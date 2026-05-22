import { VendorDashboardFrame } from "@/components/vendor-dashboard-frame";
import { VendorProfileForm } from "@/components/vendor-dashboard-widgets";
import { requireVendorDashboard } from "@/lib/vendor-auth";

export default async function VendorProfilePage() {
  const { vendor } = await requireVendorDashboard();
  return <VendorDashboardFrame vendor={vendor} title="Profile"><VendorProfileForm vendor={vendor} canManageStore={vendor.status !== "suspended"} /></VendorDashboardFrame>;
}