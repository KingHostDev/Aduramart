import { Mail, MessageCircle, UserRound } from "lucide-react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { requireAdminPage } from "@/lib/admin-auth";
import { getAdminMessages } from "@/lib/queries";

export default async function AdminMessagesPage() {
  await requireAdminPage();
  const messages = await getAdminMessages();

  return (
    <main className="admin-shell">
      <div className="admin-workspace">
        <AdminSidebar />
        <section className="grid gap-6">
          <div className="admin-card">
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#6C3CF0]">Messages</p>
            <h1 className="mt-3 text-4xl font-black">Buyer, vendor, and admin conversations.</h1>
            <p className="mt-3 max-w-3xl leading-8 text-[#6B7280]">Messages submitted from vendor profiles, buyer support, and suspended vendor contact forms appear here for admin follow-up.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Metric title="Total messages" value={messages.length} />
            <Metric title="New" value={messages.filter((message) => message.status === "new").length} />
            <Metric title="To vendors" value={messages.filter((message) => message.recipientType === "vendor").length} />
          </div>

          <section className="admin-card">
            <div className="flex items-center gap-3">
              <MessageCircle className="text-[#6C3CF0]" />
              <h2 className="text-2xl font-black">Message inbox</h2>
            </div>
            <div className="mt-5 grid gap-4">
              {messages.length ? (
                messages.map((message) => (
                  <article key={message.id} className="rounded-2xl border border-[#ece6ff] bg-white p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#6C3CF0]">{message.recipientType === "vendor" ? "Buyer to vendor" : "To admin"}</p>
                        <h3 className="mt-2 text-xl font-black">{message.subject}</h3>
                        <p className="mt-1 text-sm font-bold text-[#6B7280]">{new Date(message.createdAt).toLocaleString()}</p>
                      </div>
                      <span className="rounded-full bg-[#F3EEFF] px-3 py-1 text-xs font-extrabold capitalize text-[#6C3CF0]">{message.status}</span>
                    </div>
                    <p className="mt-4 whitespace-pre-wrap text-sm font-semibold leading-7 text-[#454151]">{message.body}</p>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold text-[#6B7280]">
                      <span className="inline-flex items-center gap-2"><UserRound size={16} />{message.senderName || "No name"}</span>
                      <a href={`mailto:${message.senderEmail}`} className="inline-flex items-center gap-2 text-[#6C3CF0]"><Mail size={16} />{message.senderEmail}</a>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-[#ece6ff] bg-white p-6 text-sm font-bold text-[#6B7280]">No messages yet. Run the messages migration if messages are failing to save.</div>
              )}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <article className="admin-metric-card">
      <p className="text-sm font-extrabold text-[#6B7280]">{title}</p>
      <p className="mt-3 text-3xl font-black text-[#6C3CF0]">{value}</p>
    </article>
  );
}
