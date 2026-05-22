import { VendorDashboardFrame } from "@/components/vendor-dashboard-frame";
import { ProductManagement } from "@/components/vendor-dashboard-widgets";
import { getVendorProducts } from "@/lib/queries";
import { requireVendorDashboard } from "@/lib/vendor-auth";

export default async function VendorProductsPage() {
  const { vendor } = await requireVendorDashboard();
  const products = await getVendorProducts(vendor.id);

  return (
    <VendorDashboardFrame vendor={vendor} title="Products">
      <ProductManagement products={products} canManageStore={vendor.status !== "suspended"} />
    </VendorDashboardFrame>
  );
}