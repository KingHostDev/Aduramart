import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, Box, CheckCircle2, Clock, EyeOff, Heart, MessageCircle, PackagePlus, Settings, ShieldAlert, Store, Truck } from "lucide-react";
import { DashboardLogout } from "@/components/dashboard-logout";
import { Nav } from "@/components/nav";
import { StatCard } from "@/components/ui";
import { submitProductForReview, updateVendorBio } from "@/lib/actions";
import { categories, formatNaira } from "@/lib/data";
import { getVendorByUserId, getVendorOrders, getVendorProducts } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import type { Product, Vendor } from "@/lib/types";

export default async function VendorDashboard() {
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
    return <VendorNeedsOnboarding />;
  }

  const [vendorProducts, vendorOrders] = await Promise.all([
    getVendorProducts(vendor.id),
    getVendorOrders(vendor.id)
  ]);

  const approvedProducts = vendorProducts.filter((product) => product.status === "approved").length;
  const pendingProducts = vendorProducts.filter((product) => product.status === "pending").length;
  const revenue = vendorOrders.reduce((sum, order) => sum + order.total, 0);
  const canSubmitProducts = vendor.status === "approved";

  return (
    <>
      <Nav />
      <main className="container grid gap-6 py-8 lg:grid-cols-[260px_1fr]">
        <VendorSidebar />
        <section className="grid gap-6">
          <VendorHero vendor={vendor} />
          <VendorStatusNotice vendor={vendor} />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <StatCard label="Revenue" value={formatNaira(revenue)} />
            <StatCard label="Orders" value={String(vendorOrders.length)} tone="gold" />
            <StatCard label="Approved products" value={String(approvedProducts)} tone="green" />
            <StatCard label="Pending review" value={String(pendingProducts)} tone="dark" />
            <StatCard label="Profile likes" value={vendor.likes.toLocaleString()} tone="purple" />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <ProductManagement products={vendorProducts} />
            <div className="grid gap-6">
              <StoreBioForm vendor={vendor} />
              <SubmitListingForm vendor={vendor} canSubmitProducts={canSubmitProducts} />
            </div>
          </div>

          <div className="card rounded-[22px] p-6">
            <h2 className="text-2xl font-black">Recent orders</h2>
            <div className="mt-5 grid gap-3">
              {vendorOrders.length ? (
                vendorOrders.map((order) => (
                  <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4">
                    <div>
                      <p className="font-black">{order.id}</p>
                      <p className="text-sm text-[#6B7280]">{order.customer}</p>
                    </div>
                    <p className="font-black">{formatNaira(order.total)}</p>
                    <span className="rounded-full bg-[#F3EEFF] px-3 py-1 text-xs font-extrabold capitalize text-[#6C3CF0]">{order.status.replace("-", " ")}</span>
                  </div>
                ))
              ) : (
                <EmptyState title="No orders yet" copy="Orders connected to your vendor profile will appear here." />
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function VendorSidebar() {
  return (
    <aside className="card h-fit rounded-[22px] p-4">
      {[
        [BarChart3, "Analytics"],
        [Box, "Products"],
        [Truck, "Orders"],
        [MessageCircle, "Messages"],
        [Settings, "Store settings"]
      ].map(([Icon, label]) => (
        <a key={label as string} href="#" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold hover:bg-[#F3EEFF]">
          <Icon size={18} className="text-[#6C3CF0]" />
          {label as string}
        </a>
      ))}
      <DashboardLogout />
    </aside>
  );
}

function VendorHero({ vendor }: { vendor: Vendor }) {
  return (
    <div className="soft-gradient overflow-hidden rounded-[28px]">
      <div className="relative h-48 bg-[#F3EEFF]">
        <Image src={vendor.banner} alt={vendor.storeName} fill className="object-cover" priority />
      </div>
      <div className="p-6 md:p-8">
        <div className="relative -mt-20 grid size-24 place-items-center overflow-hidden rounded-[24px] border-4 border-white bg-[#6C3CF0] text-2xl font-black text-white shadow-xl">
          {vendor.logoUrl ? <Image src={vendor.logoUrl} alt={`${vendor.storeName} logo`} fill className="object-cover" sizes="96px" /> : vendor.logo}
        </div>
        <p className="mt-5 text-sm font-extrabold uppercase tracking-[0.24em] text-[#6C3CF0]">Vendor dashboard</p>
        <h1 className="mt-3 text-4xl font-black">{vendor.storeName}</h1>
        <p className="mt-3 max-w-2xl leading-8 text-[#6B7280]">{vendor.description || "Manage your store, listings, orders, messages, delivery settings, and profile."}</p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-extrabold">
          <span className="rounded-full bg-white px-4 py-2 capitalize text-[#6C3CF0]">{vendor.status}</span>
          <span className="rounded-full bg-white px-4 py-2 text-[#6B7280]">{vendor.location}</span>
        </div>
      </div>
    </div>
  );
}

function VendorStatusNotice({ vendor }: { vendor: Vendor }) {
  const notices = {
    pending: [Clock, "Your store is pending admin review. You can view your profile, but product submission is locked until approval."],
    rejected: [ShieldAlert, "This vendor application was removed. Contact AduraMart support before submitting new listings."],
    hidden: [EyeOff, "Your store profile is hidden from the marketplace. Product submission is paused until admin restores visibility."],
    suspended: [ShieldAlert, "Your store is suspended from posting. Existing approved listings may be restricted by admin review."],
    approved: [CheckCircle2, "Your store is approved. New products still enter admin review before public marketplace display."]
  } as const;

  const [Icon, copy] = notices[vendor.status];
  const tone = vendor.status === "approved" ? "bg-[#EAFBF1] text-[#16803E]" : "bg-[#FFF9F2] text-[#B96312]";

  return (
    <div className={`flex items-start gap-3 rounded-2xl p-5 text-sm font-bold leading-7 ${tone}`}>
      <Icon className="mt-1 shrink-0" size={19} />
      {copy}
    </div>
  );
}

function ProductManagement({ products }: { products: Product[] }) {
  return (
    <div className="card rounded-[22px] p-6">
      <h2 className="text-2xl font-black">Product management</h2>
      <div className="mt-5 overflow-hidden rounded-2xl border border-[#ece6ff]">
        {products.length ? (
          products.map((product) => (
            <div key={product.id} className="grid gap-3 border-b border-[#ece6ff] bg-white p-4 last:border-b-0 md:grid-cols-[1fr_auto]">
              <div>
                <p className="font-black">{product.name}</p>
                <p className="text-sm text-[#6B7280]">{product.category} - {formatNaira(product.price)}</p>
              </div>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold ${product.status === "approved" ? "bg-[#EAFBF1] text-[#16803E]" : product.status === "pending" ? "bg-[#FFF1DF] text-[#B96312]" : "bg-[#fff1f1] text-[#EF4444]"}`}>
                {product.status === "approved" ? <CheckCircle2 size={15} /> : <Clock size={15} />}
                {product.status}
              </span>
            </div>
          ))
        ) : (
          <div className="bg-white p-6">
            <EmptyState title="No products submitted" copy="Approved vendors can submit products for admin review from the form beside this panel." />
          </div>
        )}
      </div>
    </div>
  );
}


function StoreBioForm({ vendor }: { vendor: Vendor }) {
  return (
    <form action={updateVendorBio} className="card rounded-[22px] p-6">
      <div className="flex items-center gap-3">
        <Heart className="text-[#6C3CF0]" />
        <h2 className="text-2xl font-black">Store bio</h2>
      </div>
      <p className="mt-2 text-sm font-bold leading-7 text-[#6B7280]">Update the public story buyers see on your vendor profile anytime.</p>
      <input type="hidden" name="vendorId" value={vendor.id} />
      <textarea name="description" rows={5} minLength={20} required defaultValue={vendor.description} className="mt-5 w-full rounded-2xl border border-[#ece6ff] px-4 py-3 text-sm font-semibold leading-7 outline-none focus:border-[#6C3CF0]" />
      <button className="mt-4 rounded-full bg-[#6C3CF0] px-5 py-3 font-extrabold text-white shadow-lg shadow-purple-500/20">
        Save bio
      </button>
    </form>
  );
}
function SubmitListingForm({ vendor, canSubmitProducts }: { vendor: Vendor; canSubmitProducts: boolean }) {
  return (
    <form action={submitProductForReview} className="card rounded-[22px] p-6">
      <div className="flex items-center gap-3">
        <PackagePlus className="text-[#6C3CF0]" />
        <h2 className="text-2xl font-black">Submit listing</h2>
      </div>
      <input type="hidden" name="vendorId" value={vendor.id} />
      <div className="mt-5 grid gap-3">
        <input name="name" placeholder="Product name" disabled={!canSubmitProducts} required className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0] disabled:bg-[#F9FAFB]" />
        <select name="category" disabled={!canSubmitProducts} required className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0] disabled:bg-[#F9FAFB]">
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
        <input name="price" type="number" placeholder="Price in naira" disabled={!canSubmitProducts} required className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0] disabled:bg-[#F9FAFB]" />
        <input name="stock" type="number" placeholder="Stock quantity" disabled={!canSubmitProducts} required className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0] disabled:bg-[#F9FAFB]" />
        <input name="image" type="file" accept="image/*" disabled={!canSubmitProducts} required className="rounded-2xl border border-dashed border-[#cfc2ff] bg-[#F3EEFF] px-4 py-3 text-sm font-semibold disabled:bg-[#F9FAFB]" />
        <textarea name="description" rows={4} placeholder="Product description" disabled={!canSubmitProducts} required className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0] disabled:bg-[#F9FAFB]" />
      </div>
      <button disabled={!canSubmitProducts} className="mt-4 w-full rounded-full bg-[#6C3CF0] px-5 py-3 font-extrabold text-white disabled:bg-[#d8cef8]">
        {canSubmitProducts ? "Send to admin review" : "Awaiting admin approval"}
      </button>
    </form>
  );
}

function VendorNeedsOnboarding() {
  return (
    <>
      <Nav />
      <main className="container py-10">
        <section className="soft-gradient rounded-[28px] p-6 md:p-8">
          <span className="grid size-12 place-items-center rounded-2xl bg-white text-[#6C3CF0]"><Store size={22} /></span>
          <h1 className="mt-5 text-4xl font-black">Complete your vendor onboarding.</h1>
          <p className="mt-3 max-w-2xl leading-8 text-[#6B7280]">This login is active, but no vendor profile is attached to this account yet. Submit your vendor application to enter admin review.</p>
          <Link href="/vendor/onboarding" className="mt-6 inline-flex rounded-full bg-[#6C3CF0] px-6 py-3 font-extrabold text-white">Start onboarding</Link>
        </section>
      </main>
    </>
  );
}

function EmptyState({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-2xl border border-[#ece6ff] bg-white p-5 text-sm font-bold leading-6 text-[#6B7280]">
      <p className="font-black text-[#1F1F1F]">{title}</p>
      <p className="mt-2">{copy}</p>
    </div>
  );
}
