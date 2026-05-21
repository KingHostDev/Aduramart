import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, BadgeCheck, FileText, IdCard, ImageIcon, UserRound } from "lucide-react";
import { AdminDecisionButtons } from "@/components/admin-decision-buttons";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminTopbar } from "@/components/admin-topbar";
import { getAdminVendorById } from "@/lib/queries";
import { requireAdminPage } from "@/lib/admin-auth";

export default async function AdminVendorReview({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  const { id } = await params;
  const vendor = await getAdminVendorById(id);

  if (!vendor) {
    return (
      <main className="admin-shell"><div className="admin-workspace"><AdminSidebar /><section className="grid gap-6"><AdminTopbar />
          <Link href="/admin/vendors" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#6C3CF0]">
            <ArrowLeft size={17} />
            Back to vendors
          </Link>
          <div className="admin-card mt-6">
            <h1 className="text-3xl font-black">Vendor not found</h1>
            <p className="mt-3 text-[#6B7280]">This vendor may have been removed or the record could not be loaded.</p>
          </div></section></div></main>
    );
  }

  return (
    <main className="admin-shell"><div className="admin-workspace"><AdminSidebar /><section className="grid gap-6"><AdminTopbar />
        <Link href="/admin/vendors" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#6C3CF0]">
          <ArrowLeft size={17} />
          Back to vendors
        </Link>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-6">
            <div className="admin-card overflow-hidden p-0">
              <div className="relative h-72 bg-[#F3EEFF]">
                <Image src={vendor.banner} alt={vendor.storeName} fill className="object-cover" />
              </div>
              <div className="p-6 md:p-8">
                <div className="-mt-20 grid size-24 place-items-center rounded-[24px] border-4 border-white bg-[#6C3CF0] text-2xl font-black text-white shadow-xl">
                  {vendor.logo}
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl font-black">{vendor.storeName}</h1>
                  <span className="rounded-full bg-[#FFF1DF] px-4 py-2 text-sm font-extrabold text-[#B96312]">{vendor.status}</span>
                </div>
                <p className="mt-4 max-w-3xl leading-8 text-[#6B7280]">{vendor.description || "No store description submitted."}</p>
              </div>
            </div>

            <ReviewSection title="Personal Information" icon={<UserRound className="text-[#6C3CF0]" />}>
              <InfoGrid
                items={[
                  ["Full name", vendor.ownerName],
                  ["Email", vendor.email || "Not provided"],
                  ["Phone", vendor.phone || "Not provided"],
                  ["WhatsApp", vendor.whatsapp || "Not provided"],
                  ["Location", vendor.location],
                  ["Category", vendor.category],
                  ["ID type", vendor.idType || "Not provided"],
                  ["ID number", vendor.idNumber || "Not provided"],
                  ["Date of birth", vendor.dateOfBirth || "Not provided"]
                ]}
              />
            </ReviewSection>

            <ReviewSection title="Identification" icon={<IdCard className="text-[#6C3CF0]" />}>
              <InfoGrid items={[["KYC Status", vendor.kycStatus.replaceAll("_", " ")], ["KYC Provider", vendor.kycProvider || "Smile ID"], ["KYC Reference", vendor.kycReference || "Not generated yet"]]} />
              <div className="mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                <DocumentCard title="Government ID" href={vendor.governmentIdUrl} />
                <DocumentCard title="Selfie Verification" href={vendor.selfieUrl} />
                </div>
              </div>
            </ReviewSection>

            <ReviewSection title="Store Assets" icon={<ImageIcon className="text-[#6C3CF0]" />}>
              <InfoGrid
                items={[
                  ["Store banner", vendor.banner],
                  ["Store logo", vendor.logoUrl || "No logo file submitted"],
                  ["Public status", vendor.verified ? "Verified" : "Not verified"]
                ]}
              />
            </ReviewSection>
          </div>

          <aside className="admin-card h-fit">
            <div className="flex items-center gap-3">
              <BadgeCheck className="text-[#6C3CF0]" />
              <h2 className="text-2xl font-black">Admin decision</h2>
            </div>
            <p className="mt-3 text-sm leading-7 text-[#6B7280]">
              Review the submitted information, verification files, and current lifecycle state. You can approve, hide the profile, suspend posting, restore access, or remove the vendor.
            </p>
            <div className="my-6 rounded-2xl bg-[#F3EEFF] p-5">
              <p className="text-sm font-bold text-[#6B7280]">Current status</p>
              <p className="mt-2 text-2xl font-black capitalize text-[#6C3CF0]">{vendor.status}</p>
            </div>
            <AdminDecisionButtons type="vendors" id={vendor.id} status={vendor.status} />
          </aside>
        </section></section></div></main>
  );
}

function ReviewSection({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
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

function DocumentCard({ title, href }: { title: string; href?: string | null }) {
  return (
    <div className="rounded-2xl border border-[#ece6ff] bg-white p-5">
      <FileText className="text-[#6C3CF0]" />
      <p className="mt-4 font-black">{title}</p>
      {href ? (
        <Link href={href} target="_blank" className="mt-3 inline-flex rounded-full border border-[#dcd1ff] px-4 py-2 text-sm font-extrabold text-[#6C3CF0] transition hover:bg-[#F3EEFF]">
          View uploaded file
        </Link>
      ) : (
        <p className="mt-3 text-sm font-bold text-[#EF4444]">No file submitted.</p>
      )}
    </div>
  );
}
