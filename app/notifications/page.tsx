import { Bell, CheckCircle2, Clock, PackageCheck } from "lucide-react";
import { Nav } from "@/components/nav";

const notifications = [
  ["Vendor approved", "Seraph Light Vestments is now visible on the vendors page.", "2 min ago", CheckCircle2],
  ["Listing in review", "Hand Bell for Procession is waiting for admin moderation.", "1 hr ago", Clock],
  ["Order update", "AM-24018 has moved to packed status.", "Today", PackageCheck]
];

export default function NotificationsPage() {
  return (
    <>
      <Nav />
      <main className="container py-10">
        <section className="card mx-auto max-w-3xl rounded-[24px] p-6 md:p-8">
          <div className="flex items-center gap-3">
            <Bell className="text-[#6C3CF0]" />
            <h1 className="text-3xl font-black">Notifications</h1>
          </div>
          <div className="mt-6 grid gap-3">
            {notifications.map(([title, body, time, Icon]) => (
              <div key={title as string} className="flex gap-4 rounded-2xl border border-[#ece6ff] bg-white p-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#F3EEFF] text-[#6C3CF0]">
                  <Icon />
                </span>
                <div>
                  <p className="font-black">{title as string}</p>
                  <p className="mt-1 text-sm leading-6 text-[#6B7280]">{body as string}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9CA3AF]">{time as string}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
