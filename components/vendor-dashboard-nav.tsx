"use client";

import Link from "next/link";
import { useState } from "react";
import { BarChart3, Box, HeartHandshake, Menu, MessageCircle, PackagePlus, Settings, Store, Truck, X } from "lucide-react";

const links = [
  ["Overview", "#overview", BarChart3],
  ["Products", "#products", Box],
  ["Submit listing", "#submit-listing", PackagePlus],
  ["Orders", "#orders", Truck],
  ["Store settings", "#store-settings", Settings],
  ["Contact Admin", "/messages?to=admin&topic=support", MessageCircle]
] as const;

export function VendorDashboardNav({ storeName }: { storeName: string }) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#ece6ff] bg-[#fff9f2]/95 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link href="/vendor/dashboard" onClick={close} className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#6C3CF0] text-white shadow-lg shadow-purple-500/20">
            <Store size={21} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-lg font-black">{storeName}</span>
            <span className="block text-xs font-extrabold uppercase tracking-[0.14em] text-[#6B7280]">Vendor dashboard</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {links.map(([label, href, Icon]) => (
            <Link key={label} href={href} className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-extrabold text-[#454151] transition hover:bg-[#F3EEFF] hover:text-[#6C3CF0]">
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        <button type="button" aria-label={open ? "Close vendor menu" : "Open vendor menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)} className="rounded-full border border-[#ece6ff] bg-white p-3 text-[#1f1f1f] transition hover:bg-[#F3EEFF] lg:hidden">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[#ece6ff] bg-[#FFF9F2] px-4 pb-5 pt-3 shadow-2xl shadow-purple-500/10 lg:hidden">
          <div className="mx-auto grid max-w-6xl gap-3">
            {links.map(([label, href, Icon]) => (
              <Link key={label} href={href} onClick={close} className="flex items-center gap-3 rounded-2xl border border-[#ece6ff] bg-white px-4 py-4 text-sm font-extrabold text-[#1F1F1F] transition hover:bg-[#F3EEFF]">
                <Icon size={18} className="text-[#6C3CF0]" />
                {label}
              </Link>
            ))}
            <Link href="/" onClick={close} className="flex items-center gap-3 rounded-2xl border border-[#ece6ff] bg-white px-4 py-4 text-sm font-bold text-[#6B7280]">
              <HeartHandshake size={18} className="text-[#6C3CF0]" />
              View main website
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}