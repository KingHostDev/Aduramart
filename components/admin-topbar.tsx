"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellRing, MessageCircle, Search } from "lucide-react";
import { AdminThemeToggle } from "./admin-theme-toggle";

const links = [
  ["Dashboard", "/admin/dashboard"],
  ["Vendors", "/admin/vendors"],
  ["Products", "/admin/products"],
  ["Messages", "/admin/messages"],
  ["Team", "/admin/team"]
];

export function AdminTopbar() {
  const pathname = usePathname();

  return (
    <header className="admin-topbar">
      <div className="admin-pill-tabs" aria-label="Admin sections">
        {links.map(([label, href]) => {
          const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
          return <Link key={href} href={href} className={active ? "is-active" : ""}>{label}</Link>;
        })}
      </div>
      <div className="flex items-center gap-2">
        <label className="hidden items-center gap-2 rounded-full bg-[#f4f4f1] px-4 py-3 text-sm font-extrabold text-[#6B7280] xl:flex">
          <Search size={16} />
          <span>Search admin records</span>
        </label>
        <AdminThemeToggle />
        <Link href="/admin/messages" className="admin-icon-button" aria-label="Open messages">
          <MessageCircle size={18} />
        </Link>
        <Link href="/admin/messages" className="admin-icon-button" aria-label="Open notifications">
          <BellRing size={18} />
        </Link>
      </div>
    </header>
  );
}