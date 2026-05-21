"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BarChart3,
  LayoutDashboard,
  MessageCircle,
  PackageSearch,
  Search,
  Settings,
  Shield,
  Store,
  UserCog,
  UsersRound
} from "lucide-react";
import { DashboardLogout } from "./dashboard-logout";

const adminLinks: [LucideIcon, string, string, string][] = [
  [LayoutDashboard, "Overview", "/admin/dashboard", "Live control room"],
  [BarChart3, "Analytics", "/admin/analytics", "Growth and revenue"],
  [UsersRound, "Vendors", "/admin/vendors", "Approvals and status"],
  [PackageSearch, "Products", "/admin/products", "Listing reviews"],
  [MessageCircle, "Messages", "/admin/messages", "Buyer and vendor notes"],
  [UserCog, "Team", "/admin/team", "Super admin controls"],
  [AlertTriangle, "Reports", "/admin/reports", "Safety and complaints"],
  [Shield, "Settings", "/admin/settings", "Platform rules"]
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar-card">
      <div className="admin-brand-block">
        <span className="admin-brand-icon"><Store size={20} /></span>
        <div>
          <p className="admin-brand-name">AduraMart</p>
          <p className="admin-brand-subtitle">Admin OS</p>
        </div>
      </div>

      <label className="admin-search-shell">
        <Search size={16} />
        <input type="search" placeholder="Search admin" aria-label="Search admin" />
      </label>

      <nav className="admin-nav-list" aria-label="Admin navigation">
        {adminLinks.map(([Icon, label, href, description]) => {
          const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
          return (
            <Link key={label} href={href} className={`admin-nav-link ${active ? "is-active" : ""}`}>
              <span className="admin-nav-icon"><Icon size={18} /></span>
              <span>
                <span className="admin-nav-title">{label}</span>
                <span className="admin-nav-description">{description}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-mini-callout">
          <Settings size={16} />
          <span>Live marketplace controls</span>
        </div>
        <DashboardLogout />
      </div>
    </aside>
  );
}