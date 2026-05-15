import Link from "next/link";
import { ArrowRight, BadgeCheck, Eye, EyeOff, ShieldOff, Store, Trash2 } from "lucide-react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminModerationPanel } from "@/components/admin-moderation-panel";
import { Nav } from "@/components/nav";
import { getApprovedVendors, getHiddenVendors, getPendingVendors, getRejectedVendors, getSuspendedVendors } from "@/lib/queries";
import type { Vendor } from "@/lib/types";

export default async function AdminVendorsPage() {
  const [pendingVendors, approvedVendors, hiddenVendors, suspendedVendors, rejectedVendors] = await Promise.all([
    getPendingVendors(),
    getApprovedVendors(),
    getHiddenVendors(),
    getSuspendedVendors(),
    getRejectedVendors()
  ]);

  const restrictedVendors = [...hiddenVendors, ...suspendedVendors, ...rejectedVendors];

  return (
    <>
      <Nav />
      <main className="container grid gap-6 py-8 lg:grid-cols-[280px_1fr]">
        <AdminSidebar />
        <section className="grid gap-6">
          <div className="soft-gradient rounded-[28px] p-6 md:p-8">
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#6C3CF0]">Vendors</p>
            <h1 className="mt-3 text-4xl font-black">Vendor control center.</h1>
            <p className="mt-3 max-w-3xl leading-8 text-[#6B7280]">Review new applications, audit approved vendors anytime, hide public profiles, suspend posting access, restore trusted stores, or remove vendors from the marketplace workflow.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <VendorStateCard icon={<Store />} label="Active vendors" value={approvedVendors.length} copy="Visible publicly and allowed to trade." />
            <VendorStateCard icon={<BadgeCheck />} label="Pending review" value={pendingVendors.length} copy="Waiting for admin verification." />
            <VendorStateCard icon={<EyeOff />} label="Hidden profiles" value={hiddenVendors.length} copy="Not visible on marketplace pages." />
            <VendorStateCard icon={<ShieldOff />} label="Suspended" value={suspendedVendors.length} copy="Restricted from marketplace activity." />
          </div>

          <AdminModerationPanel
            title="Pending vendor applications"
            type="vendors"
            rows={pendingVendors.map((vendor) => ({
              id: vendor.id,
              cells: [vendor.storeName, vendor.ownerName, vendor.category],
              detailsHref: `/admin/vendors/${vendor.id}`
            }))}
          />

          <VendorManagementTable title="Active vendors" vendors={approvedVendors} empty="No approved vendors yet." />
          <VendorManagementTable title="Restricted and removed vendors" vendors={restrictedVendors} empty="No hidden, suspended, or removed vendors." />
        </section>
      </main>
    </>
  );
}

function VendorStateCard({ icon, label, value, copy }: { icon: React.ReactNode; label: string; value: number; copy: string }) {
  return (
    <article className="card rounded-[18px] p-5">
      <span className="grid size-11 place-items-center rounded-2xl bg-[#F3EEFF] text-[#6C3CF0]">{icon}</span>
      <p className="mt-4 text-sm font-extrabold text-[#6B7280]">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
      <p className="mt-2 text-xs font-bold leading-5 text-[#9CA3AF]">{copy}</p>
    </article>
  );
}

function VendorManagementTable({ title, vendors, empty }: { title: string; vendors: Vendor[]; empty: string }) {
  return (
    <section className="card rounded-[22px] p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">{title}</h2>
          <p className="mt-2 text-sm font-bold leading-7 text-[#6B7280]">Open a vendor to review files, lifecycle status, and moderation controls.</p>
        </div>
      </div>
      <div className="mt-5 overflow-hidden rounded-2xl border border-[#ece6ff]">
        {vendors.length ? (
          vendors.map((vendor) => (
            <div key={vendor.id} className="grid gap-3 border-b border-[#ece6ff] bg-white p-4 last:border-b-0 md:grid-cols-[1.1fr_1fr_0.8fr_0.7fr_auto]">
              <div>
                <p className="font-black">{vendor.storeName}</p>
                <p className="text-sm font-bold text-[#6B7280]">{vendor.ownerName}</p>
              </div>
              <p className="text-sm font-bold text-[#454151]">{vendor.category}</p>
              <p className="text-sm font-bold text-[#454151]">{vendor.location}</p>
              <span className="inline-flex h-fit w-fit rounded-full bg-[#F3EEFF] px-3 py-1 text-xs font-extrabold capitalize text-[#6C3CF0]">{vendor.status}</span>
              <Link href={`/admin/vendors/${vendor.id}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#dcd1ff] px-4 py-2 text-sm font-extrabold text-[#6C3CF0] transition hover:bg-[#F3EEFF]">
                <Eye size={16} />
                Manage
              </Link>
            </div>
          ))
        ) : (
          <div className="bg-white p-6 text-sm font-bold text-[#6B7280]">{empty}</div>
        )}
      </div>
    </section>
  );
}