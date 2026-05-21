"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardLogout } from "./dashboard-logout";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, BarChart3, LayoutDashboard, MessageCircle, PackageSearch, Shield, UserCog, UsersRound } from "lucide-react";

const adminLinks: [LucideIcon, string, string][] = [
  [LayoutDashboard, "Dashboard", "/admin/dashboard"],
  [BarChart3, "Analytics", "/admin/analytics"],
  [UsersRound, "Vendors", "/admin/vendors"],
  [PackageSearch, "Product moderation", "/admin/products"],
  [MessageCircle, "Messages", "/admin/messages"],
  [UserCog, "Admin team", "/admin/team"],
  [AlertTriangle, "Reports", "/admin/reports"],
  [Shield, "Admin settings", "/admin/settings"]
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="card sticky top-24 h-fit rounded-[22px] p-4">
      <div className="mb-4 rounded-[18px] bg-[#F3EEFF] p-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#6C3CF0]">AduraMart</p>
        <p className="mt-1 text-lg font-black">Admin Suite</p>
      </div>
      <nav className="grid gap-1">
        {adminLinks.map(([Icon, label, href]) => {
          const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition ${
                active ? "bg-[#6C3CF0] text-white shadow-lg shadow-purple-500/20" : "text-[#454151] hover:bg-[#F3EEFF] hover:text-[#6C3CF0]"
              }`}
            >
              <Icon size={18} className={active ? "text-white" : "text-[#6C3CF0]"} />
              {label}
            </Link>
          );
        })}
      </nav>
      <DashboardLogout />
    </aside>
  );
}
