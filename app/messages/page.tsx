import { MessageCircle, Send } from "lucide-react";
import { Nav } from "@/components/nav";

const threads = ["Seraph Light Vestments", "Zion Oils & Candles", "Adura Books House"];

export default function MessagesPage() {
  return (
    <>
      <Nav />
      <main className="container grid gap-6 py-10 lg:grid-cols-[320px_1fr]">
        <aside className="card rounded-[22px] p-4">
          <h1 className="px-2 text-2xl font-black">Messages</h1>
          <div className="mt-5 grid gap-2">
            {threads.map((thread) => (
              <button key={thread} className="flex items-center gap-3 rounded-2xl p-4 text-left font-extrabold hover:bg-[#F3EEFF]">
                <span className="grid size-10 place-items-center rounded-full bg-[#6C3CF0] text-white">{thread.slice(0, 1)}</span>
                {thread}
              </button>
            ))}
          </div>
        </aside>
        <section className="card flex min-h-[620px] flex-col rounded-[22px] p-5">
          <div className="flex items-center gap-3 border-b border-[#ece6ff] pb-4">
            <MessageCircle className="text-[#6C3CF0]" />
            <div>
              <h2 className="font-black">Seraph Light Vestments</h2>
              <p className="text-sm text-[#22C55E]">Verified vendor</p>
            </div>
          </div>
          <div className="grid flex-1 content-end gap-3 py-5">
            <div className="max-w-[72%] rounded-[18px] bg-[#F3EEFF] p-4 text-sm leading-6">Hello, is the premium robe available in XL?</div>
            <div className="ml-auto max-w-[72%] rounded-[18px] bg-[#6C3CF0] p-4 text-sm leading-6 text-white">Yes, XL is available and can ship tomorrow within Lagos.</div>
          </div>
          <div className="flex gap-3">
            <input placeholder="Write a message..." className="flex-1 rounded-full border border-[#ece6ff] px-5 py-3 outline-none focus:border-[#6C3CF0]" />
            <button aria-label="Send message" className="grid size-12 place-items-center rounded-full bg-[#6C3CF0] text-white">
              <Send size={18} />
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
