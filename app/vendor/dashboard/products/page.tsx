import { VendorDashboardFrame } from "@/components/vendor-dashboard-frame";
import { ProductManagement, SubmitListingForm } from "@/components/vendor-dashboard-widgets";
import { getVendorProducts } from "@/lib/queries";
import { requireVendorDashboard } from "@/lib/vendor-auth";

export default async function VendorProductsPage() {
  const { vendor } = await requireVendorDashboard();
  const products = await getVendorProducts(vendor.id);
  return <VendorDashboardFrame vendor={vendor} title="Products"><section className="grid gap-6 xl:grid-cols-[1fr_420px]"><ProductManagement products={products} canManageStore={vendor.status !== "suspended"} /><SubmitListingForm vendor={vendor} canSubmitProducts={vendor.status === "approved"} /></section></VendorDashboardFrame>;
}