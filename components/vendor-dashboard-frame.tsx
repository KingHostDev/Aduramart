import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { VendorDashboardSidebar } from "@/components/vendor-dashboard-sidebar";
import type { Vendor } from "@/lib/types";

export function VendorDashboardFrame({ vendor, title, children }: { vendor: Vendor; title?: string; children: React.ReactNode }) {
  return (
    <div className="vendor-dashboard-shell">
      <VendorDashboardSidebar storeName={vendor.storeName} />
      <main className="vendor-dashboard-main">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link href="/vendor/dashboard" className="inline-flex items-center gap-2 rounded-full border border-[#dcd1ff] bg-white px-4 py-2 text-sm font-extrabold text-[#6C3CF0] transition hover:bg-[#F3EEFF]">
            <ArrowLeft size={17} />
            Back
          </Link>
          {title ? <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#6C3CF0]">{title}</p> : null}
        </div>
        {children}
      </main>
    </div>
  );
}