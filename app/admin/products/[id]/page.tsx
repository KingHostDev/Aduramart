import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, Boxes, FileText, ImageIcon, PackageCheck, Store } from "lucide-react";
import { AdminDecisionButtons } from "@/components/admin-decision-buttons";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminTopbar } from "@/components/admin-topbar";
import { formatNaira } from "@/lib/data";
import { getAdminProductById } from "@/lib/queries";
import { requireAdminPage } from "@/lib/admin-auth";

export default async function AdminProductReview({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  const { id } = await params;
  const product = await getAdminProductById(id);

  if (!product) {
    return (
      <main className="admin-shell"><div className="admin-workspace"><AdminSidebar /><section className="grid gap-6">
          <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#6C3CF0]">
            <ArrowLeft size={17} />
            Back to products
          </Link>
          <div className="admin-card mt-6">
            <h1 className="text-3xl font-black">Product not found</h1>
            <p className="mt-3 text-[#6B7280]">This submitted product may have been removed or the record could not be loaded.</p>
          </div></section></div></main>
    );
  }

  return (
    <main className="admin-shell"><div className="admin-workspace">
        <AdminSidebar />
        <section className="grid gap-6">
          <AdminTopbar />
          <Link href="/admin/products" className="inline-flex w-fit items-center gap-2 text-sm font-extrabold text-[#6C3CF0]">
            <ArrowLeft size={17} />
            Back to products
          </Link>

          <div className="admin-card">
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#6C3CF0]">Listing review</p>
            <h1 className="mt-3 text-4xl font-black">{product.name}</h1>
            <p className="mt-3 max-w-3xl leading-8 text-[#6B7280]">Review exactly what the vendor submitted. Admins can approve or reject, but this view does not edit vendor content.</p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <div className="grid gap-6">
              <section className="admin-card p-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-[#F3EEFF]">
                  <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" priority />
                </div>
                {product.images.length > 1 ? (
                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {product.images.slice(0, 5).map((image, index) => (
                      <a key={image} href={image} target="_blank" className="relative aspect-square overflow-hidden rounded-xl border border-[#ece6ff] bg-[#F3EEFF]">
                        <Image src={image} alt={`${product.name} submitted image ${index + 1}`} fill className="object-cover" sizes="120px" />
                      </a>
                    ))}
                  </div>
                ) : null}
              </section>

              <ReviewSection title="Submitted Product Details" icon={<FileText className="text-[#6C3CF0]" />}>
                <InfoGrid
                  items={[
                    ["Product name", product.name],
                    ["Vendor", product.vendorName],
                    ["Category", product.category],
                    ["Price", formatNaira(product.price)],
                    ["Stock", product.stock.toLocaleString()],
                    ["Status", product.status],
                    ["Featured", product.featured ? "Yes" : "No"]
                  ]}
                />
              </ReviewSection>

              <ReviewSection title="Vendor Description" icon={<Boxes className="text-[#6C3CF0]" />}>
                <p className="rounded-2xl border border-[#ece6ff] bg-white p-5 text-sm font-bold leading-7 text-[#454151]">
                  {product.description || "No product description submitted."}
                </p>
              </ReviewSection>

              <ReviewSection title="Review Guidelines" icon={<PackageCheck className="text-[#6C3CF0]" />}>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    "Image matches the product and is clear.",
                    "Product belongs in the selected spiritual marketplace category.",
                    "Description is respectful, specific, and not misleading.",
                    "Price and stock look reasonable for buyer expectations."
                  ].map((item) => (
                    <div key={item} className="flex gap-3 rounded-2xl border border-[#ece6ff] bg-white p-4 text-sm font-extrabold text-[#454151]">
                      <BadgeCheck size={18} className="shrink-0 text-[#22C55E]" />
                      {item}
                    </div>
                  ))}
                </div>
              </ReviewSection>
            </div>

            <aside className="admin-card h-fit">
              <div className="flex items-center gap-3">
                <ImageIcon className="text-[#6C3CF0]" />
                <h2 className="text-2xl font-black">Admin decision</h2>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#6B7280]">Approve only if the listing follows marketplace guidelines. Reject if it needs vendor correction.</p>
              <div className="my-6 grid gap-3 rounded-2xl bg-[#F3EEFF] p-5 text-sm font-bold">
                <div className="flex items-center gap-2"><Store size={16} /> {product.vendorName}</div>
                <div className="capitalize text-[#6C3CF0]">Current status: {product.status}</div>
              </div>
              <AdminDecisionButtons type="products" id={product.id} status={product.status} />
            </aside>
          </div>
        </section></div></main>
  );
}

function ReviewSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="admin-card">
      <div className="mb-5 flex items-center gap-3">
        {icon}
        <h2 className="text-2xl font-black">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function InfoGrid({ items }: { items: string[][] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-[#ece6ff] bg-white p-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#6B7280]">{label}</p>
          <p className="mt-2 break-words text-sm font-black text-[#1F1F1F]">{value}</p>
        </div>
      ))}
    </div>
  );
}
