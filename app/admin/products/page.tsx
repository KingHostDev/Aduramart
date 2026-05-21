import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminModerationPanel } from "@/components/admin-moderation-panel";
import { ProductCard } from "@/components/ui";
import { getApprovedProducts, getPendingProducts } from "@/lib/queries";
import { requireAdminPage } from "@/lib/admin-auth";

export default async function AdminProductsPage() {
  await requireAdminPage();
  const [pendingProducts, approvedProducts] = await Promise.all([
    getPendingProducts(),
    getApprovedProducts()
  ]);

  return (
    <main className="admin-shell">
      <div className="admin-workspace">
        <AdminSidebar />
        <section className="grid gap-6">
          <div className="admin-card">
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#6C3CF0]">Product moderation</p>
            <h1 className="mt-3 text-4xl font-black">Review marketplace listings.</h1>
            <p className="mt-3 max-w-3xl leading-8 text-[#6B7280]">Products submitted by vendors remain pending until admin review accepts or rejects them.</p>
          </div>

          <AdminModerationPanel
            title="Pending product listings"
            type="products"
            rows={pendingProducts.map((product) => ({
              id: product.id,
              cells: [product.name, product.vendorName, product.category],
              detailsHref: `/admin/products/${product.id}`
            }))}
          />

          <div className="admin-card">
            <h2 className="text-2xl font-black">Live marketplace products</h2>
            <p className="mt-2 text-sm font-bold leading-7 text-[#6B7280]">These products have passed review and are visible in the marketplace.</p>
            <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {approvedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
