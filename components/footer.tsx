import Link from "next/link";
import { HeartHandshake } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#ece6ff] bg-white/72 py-12">
      <div className="container grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#6C3CF0] text-white">
              <HeartHandshake size={21} />
            </span>
            <span className="text-xl font-extrabold">AduraMart</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-7 text-[#6B7280]">
            A trusted online marketplace where spiritual vendors and worshippers connect without barriers.
          </p>
        </div>
        {[
          ["Marketplace", ["White Garments", "Candles", "Oils", "Books"]],
          ["Platform", ["Vendor onboarding", "Admin review", "Order tracking", "Messaging"]],
          ["Trust", ["Verified stores", "Secure checkout", "Support", "Guidelines"]]
        ].map(([title, items]) => (
          <div key={title as string}>
            <h3 className="font-extrabold">{title}</h3>
            <div className="mt-4 grid gap-3 text-sm text-[#6B7280]">
              {(items as string[]).map((item) => (
                <Link href={item === "Vendor onboarding" ? "/vendor/onboarding" : "/marketplace"} key={item} className="hover:text-[#6C3CF0]">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
