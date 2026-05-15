import { Bell, CreditCard, MapPin, ShieldCheck, UserRound } from "lucide-react";
import { Nav } from "@/components/nav";

export default function SettingsPage() {
  return (
    <>
      <Nav />
      <main className="container grid gap-6 py-10 lg:grid-cols-[280px_1fr]">
        <aside className="card h-fit rounded-[22px] p-4">
          {[[UserRound, "Profile"], [MapPin, "Delivery addresses"], [CreditCard, "Payments"], [Bell, "Notifications"], [ShieldCheck, "Security"]].map(([Icon, label]) => (
            <a key={label as string} href="#" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold hover:bg-[#F3EEFF]">
              <Icon size={18} className="text-[#6C3CF0]" />
              {label as string}
            </a>
          ))}
        </aside>
        <form className="card rounded-[24px] p-6 md:p-8">
          <h1 className="text-3xl font-black">Settings and profile</h1>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {["Full name", "Email", "Phone", "Default city"].map((field) => (
              <label key={field} className="grid gap-2 text-sm font-extrabold">
                {field}
                <input placeholder={field} className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0]" />
              </label>
            ))}
            <label className="grid gap-2 text-sm font-extrabold md:col-span-2">
              Delivery address
              <textarea rows={4} placeholder="Default delivery address" className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0]" />
            </label>
          </div>
          <button className="mt-6 rounded-full bg-[#6C3CF0] px-6 py-3 font-extrabold text-white">Save changes</button>
        </form>
      </main>
    </>
  );
}
