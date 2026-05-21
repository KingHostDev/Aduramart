import { AlertTriangle, BadgeCheck, MessageSquareWarning, ShieldAlert } from "lucide-react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminTopbar } from "@/components/admin-topbar";
import { requireAdminPage } from "@/lib/admin-auth";

export default async function AdminReportsPage() {
  await requireAdminPage();
  return (
    <main className="admin-shell">
      <div className="admin-workspace">
        <AdminSidebar />
        <section className="grid gap-6">
          <AdminTopbar />
          <div className="admin-card">
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#6C3CF0]">Reports</p>
            <h1 className="mt-3 text-4xl font-black">Trust and safety reports.</h1>
            <p className="mt-3 max-w-3xl leading-8 text-[#6B7280]">Track flagged vendors, suspicious listings, buyer complaints, and moderation follow-ups.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              [AlertTriangle, "Vendor reports", "Flags about store identity, delivery behavior, or verification concerns."],
              [ShieldAlert, "Product reports", "Flags about unsafe, duplicate, misleading, or unapproved listings."],
              [MessageSquareWarning, "Message reports", "Buyer/vendor conversations that need admin attention."]
            ].map(([Icon, title, copy]) => (
              <article key={title as string} className="admin-metric-card">
                <Icon className="text-[#EF4444]" />
                <h2 className="mt-4 text-xl font-black">{title as string}</h2>
                <p className="mt-3 text-sm font-bold leading-7 text-[#6B7280]">{copy as string}</p>
              </article>
            ))}
          </div>
          <div className="admin-card">
            <div className="flex items-center gap-3">
              <BadgeCheck className="text-[#22C55E]" />
              <h2 className="text-2xl font-black">Report queue</h2>
            </div>
            <p className="mt-3 text-sm font-bold leading-7 text-[#6B7280]">No active reports right now. Once users begin reporting vendors, products, or messages, the queue should show reporter, reason, linked record, priority, and admin action.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
