import { VendorDashboardFrame } from "@/components/vendor-dashboard-frame";
import { VendorPaymentSettings } from "@/components/vendor-dashboard-widgets";
import { requireVendorDashboard } from "@/lib/vendor-auth";

export default async function VendorPaymentsPage() {
  const { vendor } = await requireVendorDashboard();
  return <VendorDashboardFrame vendor={vendor} title="Payments"><VendorPaymentSettings vendor={vendor} /></VendorDashboardFrame>;
}