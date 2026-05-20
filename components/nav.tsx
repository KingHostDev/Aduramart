"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, HeartHandshake, Menu, Search, ShoppingBag, Store, X } from "lucide-react";
import { useState } from "react";

const links = [
  ["Marketplace", "/marketplace"],
  ["Vendors", "/vendors"]
];

const quickLinks = [
  ["Search", "/marketplace", Search],
  ["Notifications", "/notifications", Bell],
  ["Cart", "/cart", ShoppingBag]
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-[#fff9f2]/92 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link href="/" onClick={closeMenu} className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#6C3CF0] text-white shadow-lg shadow-purple-500/20">
            <HeartHandshake size={22} />
          </span>
          <span className="block truncate text-xl font-extrabold tracking-tight">AduraMart</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-bold text-[#454151] lg:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className={`transition hover:text-[#6C3CF0] ${pathname === href ? "text-[#6C3CF0]" : ""}`}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link aria-label="Search" href="/marketplace" className="hidden rounded-full border border-[#ece6ff] bg-white p-3 text-[#1f1f1f] transition hover:bg-[#F3EEFF] sm:block">
            <Search size={18} />
          </Link>
          <Link aria-label="Notifications" href="/notifications" className="hidden rounded-full border border-[#ece6ff] bg-white p-3 text-[#1f1f1f] transition hover:bg-[#F3EEFF] sm:block">
            <Bell size={18} />
          </Link>
          <Link aria-label="Cart" href="/cart" className="rounded-full border border-[#ece6ff] bg-white p-3 text-[#1f1f1f] transition hover:bg-[#F3EEFF]">
            <ShoppingBag size={18} />
          </Link>
          <Link href="/vendor/onboarding" className="hidden items-center gap-2 rounded-full bg-[#6C3CF0] px-5 py-3 text-sm font-extrabold !text-white shadow-lg shadow-purple-500/20 transition hover:bg-[#5b2fe0] md:flex">
            <Store size={17} />
            Become a Vendor
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="rounded-full border border-[#ece6ff] bg-white p-3 text-[#1f1f1f] transition hover:bg-[#F3EEFF] lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-[#ece6ff] bg-[#FFF9F2] px-4 pb-5 pt-3 shadow-2xl shadow-purple-500/10 lg:hidden">
          <div className="mx-auto grid max-w-6xl gap-3">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className={`rounded-2xl border px-4 py-4 text-sm font-extrabold transition ${pathname === href ? "border-[#6C3CF0] bg-[#F3EEFF] text-[#6C3CF0]" : "border-[#ece6ff] bg-white text-[#1F1F1F] hover:bg-[#F3EEFF]"}`}
              >
                {label}
              </Link>
            ))}

            <div className="grid grid-cols-3 gap-2">
              {quickLinks.map(([label, href, Icon]) => (
                <Link key={href as string} href={href as string} onClick={closeMenu} className="grid min-h-20 place-items-center rounded-2xl border border-[#ece6ff] bg-white text-center text-xs font-extrabold text-[#454151] transition hover:bg-[#F3EEFF]">
                  <Icon size={18} className="text-[#6C3CF0]" />
                  <span>{label as string}</span>
                </Link>
              ))}
            </div>

            <Link href="/vendor/onboarding" onClick={closeMenu} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#6C3CF0] px-5 py-4 text-sm font-extrabold !text-white shadow-lg shadow-purple-500/20 transition hover:bg-[#5b2fe0]">
              <Store size={17} />
              Become a Vendor
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
