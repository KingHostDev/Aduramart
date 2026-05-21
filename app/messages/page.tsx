import { MessageCircle, Send } from "lucide-react";
import { Nav } from "@/components/nav";
import { submitContactMessage } from "@/lib/actions";

export default async function MessagesPage({ searchParams }: { searchParams?: Promise<{ to?: string; vendorId?: string; vendorName?: string; topic?: string; sent?: string }> }) {
  const params = await (searchParams ?? Promise.resolve({} as { to?: string; vendorId?: string; vendorName?: string; topic?: string; sent?: string }));
  const recipientType = params.to === "vendor" ? "vendor" : "admin";
  const vendorName = params.vendorName ? decodeURIComponent(params.vendorName) : "Vendor";
  const title = recipientType === "vendor" ? `Message ${vendorName}` : "Message AduraMart Admin";
  const defaultSubject = params.topic === "suspension" ? "Suspended account review" : recipientType === "vendor" ? `Question for ${vendorName}` : "AduraMart support request";

  return (
    <>
      <Nav />
      <main className="container grid gap-6 py-10 lg:grid-cols-[320px_1fr]">
        <aside className="card rounded-[22px] p-4">
          <h1 className="px-2 text-2xl font-black">Messages</h1>
          <div className="mt-5 grid gap-2">
            {[
              ["Admin support", "/messages?to=admin"],
              ["Vendor question", "/vendors"],
              ["Suspension review", "/messages?to=admin&topic=suspension"]
            ].map(([label, href]) => (
              <a key={href} href={href} className="flex items-center gap-3 rounded-2xl p-4 text-left font-extrabold hover:bg-[#F3EEFF]">
                <span className="grid size-10 place-items-center rounded-full bg-[#6C3CF0] text-white">{label.slice(0, 1)}</span>
                {label}
              </a>
            ))}
          </div>
        </aside>
        <section className="card rounded-[22px] p-5">
          <div className="flex items-center gap-3 border-b border-[#ece6ff] pb-4">
            <MessageCircle className="text-[#6C3CF0]" />
            <div>
              <h2 className="font-black">{title}</h2>
              <p className="text-sm text-[#22C55E]">Messages are saved for AduraMart follow-up.</p>
            </div>
          </div>

          {params.sent ? <Notice status={params.sent} /> : null}

          <form action={submitContactMessage} className="mt-6 grid gap-4">
            <input type="hidden" name="recipientType" value={recipientType} />
            <input type="hidden" name="recipientId" value={params.vendorId ?? ""} />
            <label className="grid gap-2 text-sm font-extrabold">
              Your name
              <input name="senderName" placeholder="Full name" className="rounded-2xl border border-[#ece6ff] px-5 py-3 font-semibold outline-none focus:border-[#6C3CF0]" />
            </label>
            <label className="grid gap-2 text-sm font-extrabold">
              Email address
              <input name="senderEmail" type="email" placeholder="you@example.com" required className="rounded-2xl border border-[#ece6ff] px-5 py-3 font-semibold outline-none focus:border-[#6C3CF0]" />
            </label>
            <label className="grid gap-2 text-sm font-extrabold">
              Subject
              <input name="subject" defaultValue={defaultSubject} required className="rounded-2xl border border-[#ece6ff] px-5 py-3 font-semibold outline-none focus:border-[#6C3CF0]" />
            </label>
            <label className="grid gap-2 text-sm font-extrabold">
              Message
              <textarea name="body" rows={8} minLength={10} placeholder="Write your message..." required className="rounded-2xl border border-[#ece6ff] px-5 py-3 font-semibold leading-7 outline-none focus:border-[#6C3CF0]" />
            </label>
            <button className="inline-flex w-fit items-center gap-2 rounded-full bg-[#6C3CF0] px-6 py-3 font-extrabold text-white">
              Send message
              <Send size={18} />
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

function Notice({ status }: { status: string }) {
  const messages: Record<string, string> = {
    "1": "Message sent. AduraMart will follow up.",
    incomplete: "Add your email, subject, and a message of at least 10 characters.",
    failed: "Message could not be saved. Run the messages migration in Supabase, then try again.",
    "not-configured": "Supabase service role is not configured."
  };
  const success = status === "1";

  return <div className={`mt-5 rounded-2xl p-4 text-sm font-extrabold ${success ? "bg-[#EAFBF1] text-[#16803E]" : "bg-[#fff1f1] text-[#EF4444]"}`}>{messages[status] ?? messages.failed}</div>;
}
