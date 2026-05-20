import Link from "next/link";
import { ArrowRight, KeyRound, Mail, Store } from "lucide-react";
import { Footer } from "@/components/footer";
import { sendVendorRecoveryOtp } from "@/lib/actions";

export default async function VendorRecoverPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  const params = await (searchParams ?? Promise.resolve({} as { error?: string }));

  return (
    <>
      <main className="bg-[#202020] px-3 py-8 md:px-6 md:py-12">
        <div className="container max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-black text-white shadow-2xl shadow-black/30">
          <div className="grid min-h-[560px] lg:grid-cols-[0.9fr_1.1fr]">
            <section className="relative overflow-hidden border-b border-white/10 p-6 md:p-9 lg:border-b-0 lg:border-r">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_16%,rgba(174,93,255,0.82),transparent_30rem),radial-gradient(circle_at_82%_74%,rgba(21,151,125,0.72),transparent_28rem),linear-gradient(145deg,#09070f,#151017_58%,#051d19)]" />
              <div className="absolute inset-0 bg-black/18" />
              <div className="relative z-10 flex min-h-full flex-col justify-between gap-10">
                <Link href="/" className="inline-flex w-fit items-center gap-3 text-white">
                  <span className="grid size-10 place-items-center rounded-2xl bg-white text-[#6C3CF0]"><Store size={20} /></span>
                  <span className="text-xl font-extrabold">AduraMart</span>
                </Link>
                <div>
                  <p className="text-sm font-bold text-white/72">Vendor recovery</p>
                  <h1 className="mt-3 max-w-sm text-4xl font-extrabold leading-tight tracking-normal">Recover your vendor access.</h1>
                  <p className="mt-4 max-w-sm text-sm font-semibold leading-7 text-white/68">Enter your vendor email and AduraMart will send a recovery code to your mailbox.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm font-semibold leading-7 text-white/70">Use the same email you registered with as a vendor.</div>
              </div>
            </section>

            <section className="bg-black p-6 md:p-10">
              <form action={sendVendorRecoveryOtp} className="mx-auto flex min-h-full max-w-md flex-col justify-center">
                <div className="mb-7 text-center">
                  <p className="text-sm font-bold text-white/48">Forgot password</p>
                  <h2 className="mt-2 text-3xl font-extrabold">Send recovery code</h2>
                  <p className="mt-2 text-sm font-semibold text-white/46">We will email your password recovery code.</p>
                </div>

                {params.error ? <Notice message={recoverErrorMessage(params.error)} /> : null}

                <label className="grid gap-2 text-xs font-bold text-white/76">
                  Vendor Email
                  <span className="flex items-center gap-3 rounded-xl border border-white/10 bg-white px-4 py-3 text-[#111111]">
                    <Mail size={18} className="text-[#6B7280]" />
                    <input name="email" type="email" placeholder="vendor@example.com" className="w-full bg-transparent font-semibold text-[#111111] outline-none placeholder:text-[#8b8b8b]" required />
                  </span>
                </label>

                <button type="submit" className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-extrabold text-black transition hover:bg-white/88">
                  Send recovery code
                  <ArrowRight size={17} />
                </button>

                <Link href="/vendor-login" className="mt-3 inline-flex items-center justify-center rounded-full border border-white/12 px-6 py-4 text-sm font-extrabold text-white/76 transition hover:bg-white/8 hover:text-white">
                  Back to vendor login
                </Link>
              </form>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Notice({ message }: { message: string }) {
  return <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm font-bold text-red-200">{message}</div>;
}

function recoverErrorMessage(error: string) {
  const messages: Record<string, string> = {
    "not-configured": "Supabase is not configured on this deployment.",
    "email-required": "Enter your vendor email first.",
    "send-failed": "AduraMart could not send the recovery code. Please try again."
  };

  return messages[error] ?? "AduraMart could not send the recovery code. Please try again.";
}
