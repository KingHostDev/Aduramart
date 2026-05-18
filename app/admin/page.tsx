import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { Nav } from "@/components/nav";
import { loginAdmin } from "@/lib/actions";

export default async function AdminLoginPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  const params = searchParams ? await searchParams : {};

  return (
    <>
      <Nav />
      <main className="container grid min-h-[calc(100vh-80px)] items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#6C3CF0]">Admin access</p>
          <h1 className="mt-4 text-5xl font-black tracking-tight">Moderate AduraMart with clarity.</h1>
          <p className="mt-5 max-w-xl leading-8 text-[#6B7280]">Review vendor applications, approve listings, manage reports, and keep the marketplace trusted.</p>
          <div className="mt-8 card rounded-[18px] p-5 text-sm font-extrabold">
            <ShieldCheck className="mb-3 text-[#6C3CF0]" />
            Role-protected admin workflow
          </div>
        </section>
        <form action={loginAdmin} className="card rounded-[26px] p-6 md:p-8">
          <h2 className="text-3xl font-black">Admin login</h2>
          {params.error ? <LoginError error={params.error} /> : null}
          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-extrabold">
              Admin Email
              <span className="flex items-center gap-3 rounded-2xl border border-[#ece6ff] bg-white px-4 py-3">
                <Mail size={18} className="text-[#6B7280]" />
                <input name="email" type="email" placeholder="admin@aduramart.com" className="w-full outline-none" required />
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
          <button type="submit" className="mt-6 block w-full rounded-full border border-[#dcd1ff] bg-transparent px-6 py-4 text-center font-extrabold text-[#6C3CF0] transition hover:bg-[#F3EEFF]">
            Continue to admin
          </button>
        </form>
      </main>
    </>
  );
}

function LoginError({ error }: { error: string }) {
  const messages: Record<string, string> = {
    "not-configured": "Supabase environment variables are missing on this deployment.",
    unauthorized: "This account is not marked as an Admin or Super Admin.",
    invalid_credentials: "Supabase rejected the email or password.",
    email_not_confirmed: "This email is not confirmed in Supabase Auth.",
    "invalid-login": "Supabase rejected the login details."
  };

  return (
    <div className="mt-5 rounded-2xl bg-[#fff1f1] p-4 text-sm font-extrabold leading-6 text-[#EF4444]">
      {messages[error] ?? `Login failed: ${error}`}
    </div>
  );
}
