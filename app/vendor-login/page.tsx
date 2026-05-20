import Link from "next/link";
import { Footer } from "@/components/footer";
import { ArrowRight, BadgeCheck, LockKeyhole, Mail, PackageCheck, ShieldCheck, Store } from "lucide-react";
import { loginVendor } from "@/lib/actions";

export default function VendorLoginPage() {
  return (
    <>
      <main className="bg-[#202020] px-3 py-8 md:px-6 md:py-12">
        <div className="container max-w-7xl overflow-hidden rounded-[28px] border border-white/10 bg-black text-white shadow-2xl shadow-black/30">
          <div className="grid min-h-[680px] lg:grid-cols-[0.95fr_1.05fr]">
            <section className="relative overflow-hidden border-b border-white/10 p-6 md:p-9 lg:border-b-0 lg:border-r">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_16%,rgba(174,93,255,0.82),transparent_30rem),radial-gradient(circle_at_82%_74%,rgba(21,151,125,0.72),transparent_28rem),linear-gradient(145deg,#09070f,#151017_58%,#051d19)]" />
              <div className="absolute inset-0 bg-black/18" />
              <div className="relative z-10 flex min-h-full flex-col justify-between gap-10">
                <Link href="/" className="inline-flex w-fit items-center gap-3 text-white">
                  <span className="grid size-10 place-items-center rounded-2xl bg-white text-[#6C3CF0]"><Store size={20} /></span>
                  <span className="text-xl font-extrabold">AduraMart</span>
                </Link>

                <div>
                  <p className="text-sm font-bold text-white/72">Vendor portal</p>
                  <h1 className="mt-3 max-w-sm text-4xl font-extrabold leading-tight tracking-normal">Welcome back to your store.</h1>
                  <p className="mt-4 max-w-sm text-sm font-semibold leading-7 text-white/68">Manage listings, orders, buyer messages, and your public vendor profile.</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    [ShieldCheck, "Verified access"],
                    [PackageCheck, "Reviewed posts"],
                    [BadgeCheck, "Trusted profile"]
                  ].map(([Icon, label]) => (
                    <div key={label as string} className="min-h-28 rounded-2xl border border-white/10 bg-white/10 p-4 text-white/72 backdrop-blur">
                      <span className="grid size-8 place-items-center rounded-full bg-white/16 text-xs font-extrabold">✓</span>
                      <Icon className="mt-5" size={17} />
                      <span className="mt-3 block text-sm font-extrabold text-white">{label as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-black p-6 md:p-10">
              <form action={loginVendor} className="mx-auto flex min-h-full max-w-md flex-col justify-center">
                <div className="mb-7 text-center">
                  <p className="text-sm font-bold text-white/48">Vendor sign in</p>
                  <h2 className="mt-2 text-3xl font-extrabold">Continue to dashboard</h2>
                  <p className="mt-2 text-sm font-semibold text-white/46">Use your vendor email and password.</p>
                </div>

                <div className="grid gap-4">
                  <label className="grid gap-2 text-xs font-bold text-white/76">
                    Email
                    <span className="flex items-center gap-3 rounded-xl border border-white/10 bg-white px-4 py-3 text-[#111111]">
                      <Mail size={18} className="text-[#6B7280]" />
                      <input name="email" type="email" placeholder="vendor@example.com" className="w-full bg-transparent font-semibold text-[#111111] outline-none placeholder:text-[#8b8b8b]" required />
                    </span>
                  </label>
                  <label className="grid gap-2 text-xs font-bold text-white/76">
                    Password
                    <span className="flex items-center gap-3 rounded-xl border border-white/10 bg-white px-4 py-3 text-[#111111]">
                      <LockKeyhole size={18} className="text-[#6B7280]" />
                      <input name="password" type="password" placeholder="Password" className="w-full bg-transparent font-semibold text-[#111111] outline-none placeholder:text-[#8b8b8b]" required />
                    </span>
                  </label>
                </div>

                <button type="submit" className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-extrabold text-black transition hover:bg-white/88">
                  Continue to dashboard
                  <ArrowRight size={17} />
                </button>

                <Link href="/vendor/onboarding" className="mt-3 inline-flex items-center justify-center rounded-full border border-white/12 px-6 py-4 text-sm font-extrabold text-white/76 transition hover:bg-white/8 hover:text-white">
                  Create vendor account
                </Link>

                <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm font-bold text-white/42">
                  <a href="#" className="transition hover:text-white">Recover password</a>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}