"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BarChart3, Box, ChevronLeft, ChevronRight, CreditCard, HeartHandshake, MessageCircle, PackagePlus, Settings, Store, Truck, UserRound } from "lucide-react";
import { DashboardLogout } from "./dashboard-logout";

const links = [
  ["Overview", "/vendor/dashboard", BarChart3],
  ["Products", "/vendor/dashboard/products", Box],
  ["Submit", "/vendor/dashboard/products/new", PackagePlus],
  ["Orders", "/vendor/dashboard/orders", Truck],
  ["Profile", "/vendor/dashboard/profile", UserRound],
  ["Payments", "/vendor/dashboard/payments", CreditCard],
  ["Messages", "/vendor/dashboard/messages", MessageCircle],
  ["Settings", "/vendor/dashboard/settings", Settings]
] as const;

export function VendorDashboardSidebar({ storeName, logoUrl, initials }: { storeName: string; logoUrl?: string | null; initials?: string }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("vendor-sidebar-collapsed", collapsed);
    return () => document.documentElement.classList.remove("vendor-sidebar-collapsed");
  }, [collapsed]);

  return (
    <aside className="vendor-fixed-sidebar">
      <div className="vendor-sidebar-head">
        <Link href="/vendor/dashboard" className="vendor-sidebar-brand" aria-label="Vendor dashboard home">
          <span className="vendor-sidebar-logo"><Store size={22} /></span>
          <span className="vendor-sidebar-text">
            <span className="vendor-sidebar-title">AduraMart</span>
            <span className="vendor-sidebar-subtitle">Vendor dashboard</span>
          </span>
        </Link>
        <button type="button" onClick={() => setCollapsed((value) => !value)} className="vendor-collapse-btn" aria-label={collapsed ? "Expand vendor sidebar" : "Collapse vendor sidebar"}>
          {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
        </button>
      </div>

      <div className="">
        <span className="vendor-profile-avatar mt-6">
          {logoUrl ? <Image src={logoUrl} alt={storeName} fill className="object-cover" sizes="72px" /> : <span>{initials || storeName.slice(0, 2).toUpperCase()}</span>}
        </span>
        <span className="vendor-sidebar-text mt-5">
          <span className="vendor-profile-name mt-5 font-medium">{storeName}</span>
        </span>
      </div>

      <nav className="vendor-sidebar-nav" aria-label="Vendor dashboard navigation">
        {links.map(([label, href, Icon]) => (
          <Link key={label} href={href} className="vendor-sidebar-link">
            <Icon size={19} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="vendor-sidebar-bottom">
        <Link href="/" className="vendor-sidebar-link muted">
          <HeartHandshake size={19} />
          <span>Main website</span>
        </Link>
        <DashboardLogout />
      </div>
    </aside>
  );
}