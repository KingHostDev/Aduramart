import { MessageCircle, Send, UserRound } from "lucide-react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminTopbar } from "@/components/admin-topbar";
import { requireAdminPage } from "@/lib/admin-auth";
import { getAdminMessages } from "@/lib/queries";

export default async function AdminMessagesPage() {
  await requireAdminPage();
  const messages = await getAdminMessages();
  const selected = messages[0];

  return (
    <main className="admin-shell">
      <div className="admin-workspace">
        <AdminSidebar />
        <section className="grid gap-5">
          <AdminTopbar />

          <div className="admin-card">
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#6C3CF0]">Messages</p>
            <h1 className="mt-3 text-4xl font-black">Support conversations.</h1>
            <p className="mt-3 max-w-3xl leading-8 text-[#6B7280]">Buyer, vendor, and suspended account messages are arranged like a support inbox so admins can read context quickly.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Metric title="Total conversations" value={messages.length} />
            <Metric title="New" value={messages.filter((message) => message.status === "new").length} />
            <Metric title="Vendor chats" value={messages.filter((message) => message.recipientType === "vendor").length} />
          </div>

          <section className="grid min-h-[680px] overflow-hidden rounded-[30px] border border-[rgba(20,20,20,0.08)] bg-white/88 shadow-2xl shadow-black/5 lg:grid-cols-[360px_1fr]">
            <aside className="border-b border-[#ece6ff] bg-[#f7f6fb] p-4 lg:border-b-0 lg:border-r">
              <div className="flex items-center justify-between gap-3 px-2 py-2">
                <div>
                  <h2 className="text-xl font-black">Inbox</h2>
                  <p className="text-sm font-bold text-[#6B7280]">Latest first</p>
                </div>
                <span className="grid size-11 place-items-center rounded-2xl bg-[#6C3CF0] text-white"><MessageCircle size={19} /></span>
              </div>
              <div className="mt-4 grid gap-2">
                {messages.length ? messages.map((message, index) => (
                  <a key={message.id} href={`#message-${message.id}`} className={`rounded-2xl border p-4 transition hover:bg-white ${index === 0 ? "border-[#6C3CF0] bg-white shadow-lg shadow-purple-500/10" : "border-transparent bg-transparent"}`}>
                    <div className="flex items-start gap-3">
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#F3EEFF] text-sm font-black text-[#6C3CF0]">
                        {(message.senderName || message.senderEmail).slice(0, 1).toUpperCase()}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-black">{message.senderName || "Unknown sender"}</span>
                          <span className="text-[0.68rem] font-extrabold uppercase text-[#9CA3AF]">{message.status}</span>
                        </span>
                        <span className="mt-1 block truncate text-sm font-bold text-[#6B7280]">{message.subject}</span>
                      </span>
                    </div>
                  </a>
                )) : <p className="rounded-2xl bg-white p-5 text-sm font-bold text-[#6B7280]">No conversations yet.</p>}
              </div>
            </aside>

            <div className="flex min-h-[680px] flex-col">
              <div className="flex items-center justify-between gap-4 border-b border-[#ece6ff] p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-full bg-[#F3EEFF] text-[#6C3CF0]"><UserRound size={19} /></span>
                  <div>
                    <h2 className="font-black">{selected ? selected.subject : "No active conversation"}</h2>
                    <p className="text-sm font-bold text-[#6B7280]">{selected ? selected.senderEmail : "Messages will appear here"}</p>
                  </div>
                </div>
                {selected ? <span className="rounded-full bg-[#EAFBF1] px-3 py-1 text-xs font-extrabold uppercase text-[#16803E]">{selected.recipientType === "vendor" ? "Buyer to vendor" : "To admin"}</span> : null}
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto bg-[#fbfaf8] p-5">
                {messages.length ? messages.map((message) => (
                  <article key={message.id} id={`message-${message.id}`} className="max-w-3xl">
                    <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#9CA3AF]">
                      <span>{new Date(message.createdAt).toLocaleString()}</span>
                      <span>-</span>
                      <span>{message.senderName || message.senderEmail}</span>
                    </div>
                    <div className="rounded-[24px] rounded-tl-md bg-white p-5 shadow-lg shadow-black/5">
                      <h3 className="font-black">{message.subject}</h3>
                      <p className="mt-3 whitespace-pre-wrap text-sm font-semibold leading-7 text-[#454151]">{message.body}</p>
                    </div>
                  </article>
                )) : <p className="rounded-2xl bg-white p-6 text-sm font-bold text-[#6B7280]">Run the messages migration if messages are failing to save.</p>}
              </div>

              <div className="border-t border-[#ece6ff] bg-white p-4">
                <div className="flex items-center gap-3 rounded-full border border-[#ece6ff] bg-[#f7f6fb] px-4 py-3 text-sm font-bold text-[#6B7280]">
                  <span className="flex-1">Admin reply workflow will attach here when two-way chat is enabled.</span>
                  <span className="grid size-10 place-items-center rounded-full bg-[#6C3CF0] text-white"><Send size={17} /></span>
                </div>
              </div>
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