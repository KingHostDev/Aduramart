import { Crown, KeyRound, Mail, Phone, ShieldCheck, UserCog, UsersRound } from "lucide-react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Nav } from "@/components/nav";
import { createAdminAccount } from "@/lib/actions";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { getAdminProfiles } from "@/lib/queries";
import { requireAdminPage } from "@/lib/admin-auth";

export default async function AdminTeamPage({ searchParams }: { searchParams?: Promise<{ created?: string; error?: string }> }) {
  await requireAdminPage();
  const [admins, currentSuperAdmin, params] = await Promise.all([
    getAdminProfiles(),
    requireSuperAdmin(),
    searchParams ?? Promise.resolve({} as { created?: string; error?: string })
  ]);
  const superAdmins = admins.filter((admin) => admin.role === "super_admin");
  const operators = admins.filter((admin) => admin.role === "admin");

  return (
    <>
      <Nav />
      <main className="container grid gap-5 py-6 lg:grid-cols-[260px_1fr]">
        <AdminSidebar />
        <section className="grid gap-5">
          <div className="soft-gradient rounded-[24px] p-5 md:p-7">
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#6C3CF0]">Admin team</p>
            <h1 className="mt-3 text-4xl font-black">Super Admins and Admins.</h1>
            <p className="mt-3 max-w-3xl leading-8 text-[#6B7280]">Super Admins can create admin profiles with login passwords. Admins can help manage vendor reviews, listing moderation, reports, and support operations.</p>
          </div>

          {params.created ? <Notice tone="success" message="Admin account created. The new admin can now log in with the email and password you set." /> : null}
          {params.error ? <Notice tone="error" message={adminErrorMessage(params.error)} /> : null}

          <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              <RoleCard icon={<Crown />} title="Super Admin" copy="Can create admins, manage platform settings, review vendors, moderate products, and control marketplace trust operations." />
              <RoleCard icon={<ShieldCheck />} title="Admin" copy="Can support daily operations such as vendor review, product moderation, reports, and customer/vendor support." />
            </div>

            <section className="card rounded-[22px] p-5 md:p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-[#F3EEFF] text-[#6C3CF0]"><UserCog size={20} /></span>
                <div>
                  <h2 className="text-2xl font-black">Create admin account</h2>
                  <p className="mt-1 text-sm font-bold text-[#6B7280]">Only Super Admins can create another Admin or Super Admin.</p>
                </div>
              </div>

              {currentSuperAdmin ? (
                <form action={createAdminAccount} className="mt-5 grid gap-4 md:grid-cols-2">
                  <Field name="fullName" label="Full name" placeholder="Admin full name" icon={<UsersRound size={18} />} />
                  <Field name="email" label="Email address" placeholder="admin@aduramart.com" type="email" icon={<Mail size={18} />} />
                  <Field name="phone" label="Phone number" placeholder="+234..." icon={<Phone size={18} />} required={false} />
                  <Field name="password" label="Password" placeholder="Set secure password" type="password" icon={<KeyRound size={18} />} />
                  <label className="grid gap-2 text-sm font-extrabold text-[#1F1F1F] md:col-span-2">
                    Admin role
                    <select name="role" className="rounded-2xl border border-[#ece6ff] bg-white px-4 py-3 font-semibold outline-none focus:border-[#6C3CF0]">
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </label>
                  <button type="submit" className="rounded-full bg-[#6C3CF0] px-6 py-4 font-extrabold text-white shadow-lg shadow-purple-500/20 transition hover:bg-[#5b2fe0] md:col-span-2">
                    Create admin profile
                  </button>
                </form>
              ) : (
                <div className="mt-5 rounded-2xl border border-[#fed7aa] bg-[#FFF9F2] p-5 text-sm font-bold leading-7 text-[#B96312]">
                  Log in as a Super Admin to create Admin accounts and passwords.
                </div>
              )}
            </section>
          </div>

          <TeamSection title="Super Admins" icon={<Crown className="text-[#FFB86B]" />} admins={superAdmins} empty="No super admin profile found yet." />
          <TeamSection title="Admins" icon={<UserCog className="text-[#6C3CF0]" />} admins={operators} empty="No admin operators added yet." />
        </section>
      </main>
    </>
  );
}

function Field({ label, name, placeholder, icon, type = "text", required = true }: { label: string; name: string; placeholder: string; icon: React.ReactNode; type?: string; required?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-extrabold text-[#1F1F1F]">
      {label}
      <span className="flex items-center gap-3 rounded-2xl border border-[#ece6ff] bg-white px-4 py-3">
        <span className="text-[#6C3CF0]">{icon}</span>
        <input name={name} type={type} placeholder={placeholder} required={required} className="w-full bg-transparent font-semibold outline-none" />
      </span>
    </label>
  );
}

function Notice({ tone, message }: { tone: "success" | "error"; message: string }) {
  const className = tone === "success" ? "bg-[#EAFBF1] text-[#16803E]" : "bg-[#fff1f1] text-[#EF4444]";
  return <div className={`rounded-2xl p-4 text-sm font-extrabold ${className}`}>{message}</div>;
}

function RoleCard({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) {
  return (
    <article className="card rounded-[22px] p-5">
      <span className="grid size-12 place-items-center rounded-2xl bg-[#F3EEFF] text-[#6C3CF0]">{icon}</span>
      <h2 className="mt-5 text-2xl font-black">{title}</h2>
      <p className="mt-3 text-sm font-bold leading-7 text-[#6B7280]">{copy}</p>
    </article>
  );
}

function TeamSection({ title, icon, admins, empty }: { title: string; icon: React.ReactNode; admins: { id: string; fullName: string; role: string; phone?: string | null }[]; empty: string }) {
  return (
    <section className="card rounded-[22px] p-5 md:p-6">
      <div className="flex items-center gap-3">
        {icon}
        <h2 className="text-2xl font-black">{title}</h2>
      </div>
      <div className="mt-5 overflow-hidden rounded-2xl border border-[#ece6ff]">
        {admins.length ? (
          admins.map((admin) => (
            <div key={admin.id} className="grid gap-3 border-b border-[#ece6ff] bg-white p-4 last:border-b-0 md:grid-cols-[1fr_auto_auto]">
              <div>
                <p className="font-black">{admin.fullName}</p>
                <p className="text-sm font-bold text-[#6B7280]">{admin.phone || "No phone added"}</p>
              </div>
              <span className="inline-flex h-fit w-fit rounded-full bg-[#F3EEFF] px-3 py-1 text-xs font-extrabold capitalize text-[#6C3CF0]">{admin.role.replace("_", " ")}</span>
              <UsersRound className="text-[#6C3CF0]" />
            </div>
          ))
        ) : (
          <div className="bg-white p-6 text-sm font-bold text-[#6B7280]">{empty}</div>
        )}
      </div>
    </section>
  );
}

function adminErrorMessage(error: string) {
  const messages: Record<string, string> = {
    "super-admin-required": "Only a logged-in Super Admin can create admin accounts.",
    incomplete: "Full name, email, and password are required.",
    "create-failed": "The admin auth account could not be created. Check if the email already exists.",
    "profile-failed": "The auth account was created, but the admin profile could not be saved. Check the profiles table."
  };

  return messages[error] ?? "Admin account creation failed. Please try again.";
}
