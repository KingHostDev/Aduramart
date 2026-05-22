import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Clock, EyeOff, MessageCircle, PackagePlus, ShieldAlert, Store } from "lucide-react";
import { Nav } from "@/components/nav";
import { VendorDashboardFrame } from "@/components/vendor-dashboard-frame";
import { StatCard } from "@/components/ui";
import { EmptyState } from "@/components/vendor-dashboard-widgets";
import { formatNaira } from "@/lib/data";
import { getVendorOrders, getVendorProducts } from "@/lib/queries";
import { requireVendorDashboard } from "@/lib/vendor-auth";
import type { Vendor } from "@/lib/types";

export default async function VendorDashboard() {
  const { vendor } = await requireVendorDashboard();
  const [vendorProducts, vendorOrders] = await Promise.all([getVendorProducts(vendor.id), getVendorOrders(vendor.id)]);
  const approvedProducts = vendorProducts.filter((product) => product.status === "approved").length;
  const pendingProducts = vendorProducts.filter((product) => product.status === "pending").length;
  const revenue = vendorOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <VendorDashboardFrame vendor={vendor} title="Overview">
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
        <div className="grid gap-6 xl:grid-cols-2">
          <section className="card rounded-[22px] p-6">
            <h2 className="text-2xl font-black">Quick actions</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <DashLink href="/vendor/dashboard/products#submit-listing" label="Submit listing" />
              <DashLink href="/vendor/dashboard/profile" label="Edit profile" />
              <DashLink href="/vendor/dashboard/payments" label="Payment setup" />
              <DashLink href="/vendor/dashboard/messages" label="Messages" />
            </div>
          </section>
          <section className="card rounded-[22px] p-6">
            <h2 className="text-2xl font-black">Recent orders</h2>
            <div className="mt-5 grid gap-3">
              {vendorOrders.slice(0, 4).length ? vendorOrders.slice(0, 4).map((order) => (
                <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4">
                  <div><p className="font-black">{order.id}</p><p className="text-sm text-[#6B7280]">{order.customer}</p></div>
                  <p className="font-black">{formatNaira(order.total)}</p>
                  <span className="rounded-full bg-[#F3EEFF] px-3 py-1 text-xs font-extrabold capitalize text-[#6C3CF0]">{order.status.replace("-", " ")}</span>
                </div>
              )) : <EmptyState title="No orders yet" copy="Orders connected to your vendor profile will appear here." />}
            </div>
          </section>
        </div>
      </section>
    </VendorDashboardFrame>
  );
}

function DashLink({ href, label }: { href: string; label: string }) {
  return <Link href={href} className="rounded-2xl border border-[#ece6ff] bg-white p-4 text-sm font-extrabold text-[#6C3CF0] transition hover:bg-[#F3EEFF]">{label}</Link>;
}

function VendorHero({ vendor }: { vendor: Vendor }) {
  return (
    <div className="soft-gradient overflow-hidden rounded-[28px]">
      <div className="relative h-48 bg-[#F3EEFF]"><Image src={vendor.banner} alt={vendor.storeName} fill className="object-cover" priority /></div>
      <div className="p-6 md:p-8">
        <div className="relative -mt-20 grid size-24 place-items-center overflow-hidden rounded-[24px] border-4 border-white bg-[#6C3CF0] text-2xl font-black text-white shadow-xl">{vendor.logoUrl ? <Image src={vendor.logoUrl} alt={`${vendor.storeName} logo`} fill className="object-cover" sizes="96px" /> : vendor.logo}</div>
        <p className="mt-5 text-sm font-extrabold uppercase tracking-[0.24em] text-[#6C3CF0]">Vendor dashboard</p>
        <h1 className="mt-3 text-4xl font-black">{vendor.storeName}</h1>
        <p className="mt-3 max-w-2xl leading-8 text-[#6B7280]">{vendor.description || "Manage your store, listings, orders, messages, delivery settings, and profile."}</p>
      </div>
    </div>
  );
}

function VendorStatusNotice({ vendor }: { vendor: Vendor }) {
  const notices = {
    pending: [Clock, "Your store is pending admin review. Product submission is locked until approval."],
    rejected: [ShieldAlert, "This vendor application was removed. Contact AduraMart support before submitting new listings."],
    hidden: [EyeOff, "Your store profile is hidden from the marketplace. Product submission is paused until admin restores visibility."],
    suspended: [ShieldAlert, "Your store is suspended. Store edits, product changes, and posting are disabled. Contact AduraMart admin for review."],
    approved: [CheckCircle2, "Your store is approved. New products still enter admin review before public marketplace display."]
  } as const;
  const [Icon, copy] = notices[vendor.status];
  const tone = vendor.status === "approved" ? "bg-[#EAFBF1] text-[#16803E]" : "bg-[#FFF9F2] text-[#B96312]";
  return <div className={`flex items-start gap-3 rounded-2xl p-5 text-sm font-bold leading-7 ${tone}`}><Icon className="mt-1 shrink-0" size={19} />{copy}</div>;
}

function VendorNeedsOnboarding() {
  return (
    <>
      <Nav />
      <main className="container py-10"><section className="soft-gradient rounded-[28px] p-6 md:p-8"><span className="grid size-12 place-items-center rounded-2xl bg-white text-[#6C3CF0]"><Store size={22} /></span><h1 className="mt-5 text-4xl font-black">Complete your vendor onboarding.</h1><p className="mt-3 max-w-2xl leading-8 text-[#6B7280]">This login is active, but no vendor profile is attached to this account yet.</p><Link href="/vendor/onboarding" className="mt-6 inline-flex rounded-full bg-[#6C3CF0] px-6 py-3 font-extrabold text-white">Start onboarding</Link></section></main>
    </>
  );
}