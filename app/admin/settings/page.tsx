import { Bell, ListChecks, ShieldCheck, Star, UserCog } from "lucide-react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { requireAdminPage } from "@/lib/admin-auth";

export default async function AdminSettingsPage() {
  await requireAdminPage();
  return (
    <main className="admin-shell">
      <div className="admin-workspace">
        <AdminSidebar />
        <section className="grid gap-6">
          <div className="admin-card">
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#6C3CF0]">Admin settings</p>
            <h1 className="mt-3 text-4xl font-black">Platform controls.</h1>
            <p className="mt-3 max-w-3xl leading-8 text-[#6B7280]">Define how AduraMart reviews vendors, accepts listings, features trusted stores, and notifies admins.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              [ShieldCheck, "Approval rules", "Require identification, selfie verification, store profile, and admin review before public display."],
              [ListChecks, "Listing rules", "Products must stay pending until reviewed for category fit, clarity, imagery, and trust."],
              [Star, "Featured controls", "Feature only verified vendors and reviewed products that meet community standards."],
              [Bell, "Notification rules", "Send admins alerts when vendors register, products are submitted, or reports are created."],
              [UserCog, "Admin roles", "Use Supabase profiles with role admin before giving access to dashboard pages."]
            ].map(([Icon, title, copy]) => (
              <article key={title as string} className="admin-metric-card">
                <Icon className="text-[#6C3CF0]" />
                <h2 className="mt-4 text-xl font-black">{title as string}</h2>
                <p className="mt-3 text-sm font-bold leading-7 text-[#6B7280]">{copy as string}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
