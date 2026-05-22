import { VendorDashboardFrame } from "@/components/vendor-dashboard-frame";
import { VendorAccountSettings } from "@/components/vendor-dashboard-widgets";
import { requireVendorDashboard } from "@/lib/vendor-auth";

export default async function VendorSettingsPage() {
  const { vendor } = await requireVendorDashboard();
  return <VendorDashboardFrame vendor={vendor} title="Settings"><VendorAccountSettings vendor={vendor} /></VendorDashboardFrame>;
}