"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
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
import { useEffect, useState } from "react";
import { DashboardLogout } from "./dashboard-logout";

const adminLinks: [LucideIcon, string, string, string][] = [
  [LayoutDashboard, "Overview", "/admin/dashboard", "Live control room"],
  [BarChart3, "Analytics", "/admin/analytics", "Growth and revenue"],
  [UsersRound, "Vendors", "/admin/vendors", "Approvals and status"],
  [PackageSearch, "Products", "/admin/products", "Listing reviews"],
  [MessageCircle, "Messages", "/admin/messages", "Support inbox"],
  [UserCog, "Team", "/admin/team", "Roles"],
  [AlertTriangle, "Reports", "/admin/reports", "Safety"],
  [Shield, "Settings", "/admin/settings", "Rules"]
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("admin-sidebar-collapsed", collapsed);
    return () => document.documentElement.classList.remove("admin-sidebar-collapsed");
  }, [collapsed]);

  return (
    <aside className="admin-sidebar-card">
      <div className="admin-brand-row">
        <div className="admin-brand-block">
          <span className="admin-brand-icon"><Store size={20} /></span>
          <div className="admin-sidebar-text">
            <p className="admin-brand-name">AduraMart</p>
            <p className="admin-brand-subtitle">Admin OS</p>
          </div>
        </div>
        <button type="button" onClick={() => setCollapsed((value) => !value)} className="admin-collapse-btn" aria-label={collapsed ? "Expand admin sidebar" : "Collapse admin sidebar"}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <label className="admin-search-shell">
        <Search size={16} />
        <input type="search" placeholder="Search admin" aria-label="Search admin" />
      </label>

      <nav className="admin-nav-list" aria-label="Admin navigation">
        {adminLinks.map(([Icon, label, href, description]) => {
          const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
          return (
            <Link key={label} href={href} className={`admin-nav-link ${active ? "is-active" : ""}`} title={label}>
              <span className="admin-nav-icon"><Icon size={18} /></span>
              <span className="admin-sidebar-text">
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
          <span className="admin-sidebar-text">Live controls</span>
        </div>
        <DashboardLogout />
      </div>
    </aside>
  );
}