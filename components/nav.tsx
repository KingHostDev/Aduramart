import Link from "next/link";
import { Bell, HeartHandshake, Menu, Search, ShoppingBag, Store } from "lucide-react";

const links = [
  ["Marketplace", "/marketplace"],
  ["Vendors", "/vendors"]
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-[#fff9f2]/82 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-[#6C3CF0] text-white shadow-lg shadow-purple-500/20">
            <HeartHandshake size={22} />
          </span>
          <span>
            <span className="block text-xl font-extrabold tracking-tight">AduraMart</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-bold text-[#454151] lg:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-[#6C3CF0]">
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link aria-label="Search" href="/marketplace" className="hidden rounded-full border border-[#ece6ff] bg-white p-3 text-[#1f1f1f] sm:block">
            <Search size={18} />
          </Link>
          <Link aria-label="Notifications" href="/notifications" className="hidden rounded-full border border-[#ece6ff] bg-white p-3 text-[#1f1f1f] sm:block">
            <Bell size={18} />
          </Link>
          <Link aria-label="Cart" href="/cart" className="rounded-full border border-[#ece6ff] bg-white p-3 text-[#1f1f1f]">
            <ShoppingBag size={18} />
          </Link>
          <Link href="/vendor/onboarding" className="hidden items-center gap-2 rounded-full bg-[#6C3CF0] px-5 py-3 text-sm font-extrabold !text-white shadow-lg shadow-purple-500/20 transition hover:bg-[#5b2fe0] md:flex">
            <Store size={17} />
            Become a Vendor
          </Link>
          <button aria-label="Open menu" className="rounded-full border border-[#ece6ff] bg-white p-3 lg:hidden">
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
