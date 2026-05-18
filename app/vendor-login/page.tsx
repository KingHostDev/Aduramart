import Link from "next/link";
import { LockKeyhole, Mail, ShieldCheck, Store } from "lucide-react";
import { Nav } from "@/components/nav";
import { loginVendor } from "@/lib/actions";

export default function VendorLoginPage() {
  return (
    <>
      <Nav />
      <main className="container grid min-h-[calc(100vh-80px)] items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#6C3CF0]">Vendor login</p>
          <h1 className="mt-4 text-5xl font-black tracking-tight">Manage your spiritual store with trust.</h1>
          <p className="mt-5 max-w-xl leading-8 text-[#6B7280]">Sign in to manage products, orders, messages, delivery settings, and store customization. New listings still enter review before going public.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[[Store, "Vendor dashboard"], [ShieldCheck, "Reviewed listings"]].map(([Icon, label]) => (
              <div key={label as string} className="card rounded-[18px] p-5 text-sm font-extrabold">
                <Icon className="mb-3 text-[#6C3CF0]" />
                {label as string}
              </div>
            ))}
          </div>
        </section>
        <form action={loginVendor} className="card rounded-[26px] p-6 md:p-8">
          <h2 className="text-3xl font-black">Vendor login</h2>
          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-extrabold">
              Email
              <span className="flex items-center gap-3 rounded-2xl border border-[#ece6ff] bg-white px-4 py-3">
                <Mail size={18} className="text-[#6B7280]" />
                <input name="email" type="email" placeholder="vendor@example.com" className="w-full outline-none" required />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-extrabold">
              Password
              <span className="flex items-center gap-3 rounded-2xl border border-[#ece6ff] bg-white px-4 py-3">
                <LockKeyhole size={18} className="text-[#6B7280]" />
                <input name="password" type="password" placeholder="Password" className="w-full outline-none" required />
              </span>
            </label>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button type="submit" className="block rounded-full bg-[#6C3CF0] px-6 py-4 text-center font-extrabold text-white shadow-lg shadow-purple-500/20 transition hover:bg-[#5b2fe0]">
              Continue to dashboard
            </button>
            <Link href="/vendor/onboarding" className="block rounded-full border border-[#dcd1ff] bg-transparent px-6 py-4 text-center font-extrabold text-[#6C3CF0] transition hover:bg-[#F3EEFF]">
              Become a Vendor
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap justify-end gap-3 text-sm font-bold text-[#6B7280]">
            <a href="#">Recover password</a>
          </div>
        </form>
      </main>
    </>
  );
}
