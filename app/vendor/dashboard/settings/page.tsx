import type { ReactNode } from "react";
import Link from "next/link";
import { BookOpen, Home, KeyRound, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { VendorDashboardFrame } from "@/components/vendor-dashboard-frame";
import { VendorAccountSettings } from "@/components/vendor-dashboard-widgets";
import { requireVendorDashboard } from "@/lib/vendor-auth";

export default async function VendorSettingsPage() {
  const { vendor } = await requireVendorDashboard();

  return (
    <VendorDashboardFrame vendor={vendor} title="Settings">
      <section className="grid gap-5">
        <div className="card rounded-[26px] p-6">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#6C3CF0]">Vendor settings</p>
          <h1 className="mt-2 text-3xl font-black">Manage your account preferences.</h1>
          <p className="mt-2 max-w-2xl text-sm font-bold leading-7 text-[#6B7280]">Keep your store information, address, password, conduct agreement, payment setup, and account choices in one clear place.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SettingsCard icon={<UserRound size={20} />} title="Account Information" copy="Edit owner details, WhatsApp contact, bio, and public profile information." href="/vendor/dashboard/profile" />
          <SettingsCard icon={<KeyRound size={20} />} title="Change of Password" copy="Recover or update your password using the secured email recovery flow." href="/vendor-recover" />
          <SettingsCard icon={<Home size={20} />} title="Update of Address" copy="Update your store location and delivery address if your business moves." href="/vendor/dashboard/profile" />
          <SettingsCard icon={<ShieldCheck size={20} />} title="Payment Setup" copy="Add or edit the bank account where AduraMart should settle payouts." href="/vendor/dashboard/payments" />
        </div>

        <section className="card rounded-[26px] p-6">
          <div className="flex items-center gap-3"><BookOpen className="text-[#6C3CF0]" /><h2 className="text-2xl font-black">Vendor Code of Conduct</h2></div>
          <div className="mt-4 grid gap-3 text-sm font-bold leading-7 text-[#6B7280]">
            <p>Template placeholder: Vendors should list only genuine products, use accurate images, respond respectfully to buyers, protect customer information, and follow AduraMart marketplace review decisions.</p>
            <p>You can replace this template with the full company policy text when ready.</p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="card rounded-[26px] border border-[#ffd1d1] p-6">
            <div className="flex items-center gap-3"><Trash2 className="text-[#EF4444]" /><h2 className="text-2xl font-black text-[#EF4444]">Account Deletion</h2></div>
            <p className="mt-2 text-sm font-bold leading-7 text-[#6B7280]">Deleting your account removes your vendor profile from AduraMart. Use this only when you are sure.</p>
          </div>
          <VendorAccountSettings vendor={vendor} />
        </section>
      </section>
    </VendorDashboardFrame>
  );
}

function SettingsCard({ icon, title, copy, href }: { icon: ReactNode; title: string; copy: string; href: string }) {
  return (
    <Link href={href} className="card group rounded-[24px] p-5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10">
      <span className="grid size-12 place-items-center rounded-2xl bg-[#F3EEFF] text-[#6C3CF0] transition group-hover:bg-[#6C3CF0] group-hover:text-white">{icon}</span>
      <h2 className="mt-4 text-xl font-black">{title}</h2>
      <p className="mt-2 text-sm font-bold leading-7 text-[#6B7280]">{copy}</p>
    </Link>
  );
}