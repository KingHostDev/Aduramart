import { Crown, ShieldCheck, UserCog, UsersRound } from "lucide-react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Nav } from "@/components/nav";
import { getAdminProfiles } from "@/lib/queries";

export default async function AdminTeamPage() {
  const admins = await getAdminProfiles();
  const superAdmins = admins.filter((admin) => admin.role === "super_admin");
  const operators = admins.filter((admin) => admin.role === "admin");

  return (
    <>
      <Nav />
      <main className="container grid gap-6 py-8 lg:grid-cols-[280px_1fr]">
        <AdminSidebar />
        <section className="grid gap-6">
          <div className="soft-gradient rounded-[28px] p-6 md:p-8">
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#6C3CF0]">Admin team</p>
            <h1 className="mt-3 text-4xl font-black">Super Admins and Admins.</h1>
            <p className="mt-3 max-w-3xl leading-8 text-[#6B7280]">AduraMart is built for a team. Super Admins own platform-level access; Admins handle vendor review, product moderation, reports, and support operations.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <RoleCard icon={<Crown />} title="Super Admin" copy="Full control over admins, platform settings, vendor lifecycle, product moderation, reports, and sensitive credentials." />
            <RoleCard icon={<ShieldCheck />} title="Admin" copy="Operational access for reviewing vendors, moderating listings, responding to reports, and maintaining marketplace trust." />
          </div>

          <TeamSection title="Super Admins" icon={<Crown className="text-[#FFB86B]" />} admins={superAdmins} empty="No super admin profile found yet." />
          <TeamSection title="Admins" icon={<UserCog className="text-[#6C3CF0]" />} admins={operators} empty="No admin operators added yet." />
        </section>
      </main>
    </>
  );
}

function RoleCard({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) {
  return (
    <article className="card rounded-[22px] p-6">
      <span className="grid size-12 place-items-center rounded-2xl bg-[#F3EEFF] text-[#6C3CF0]">{icon}</span>
      <h2 className="mt-5 text-2xl font-black">{title}</h2>
      <p className="mt-3 text-sm font-bold leading-7 text-[#6B7280]">{copy}</p>
    </article>
  );
}

function TeamSection({ title, icon, admins, empty }: { title: string; icon: React.ReactNode; admins: { id: string; fullName: string; role: string; phone?: string | null }[]; empty: string }) {
  return (
    <section className="card rounded-[22px] p-6">
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