import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  CheckCircle2,
  Clock3,
  Eye,
  MessageCircle,
  PackageCheck,
  PackageSearch,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  TrendingUp,
  UsersRound,
  WalletCards
} from "lucide-react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminTopbar } from "@/components/admin-topbar";
import { AdminCommerceCharts } from "@/components/admin-commerce-charts";
import { AdminModerationPanel } from "@/components/admin-moderation-panel";
import { formatNaira } from "@/lib/data";
import {
  getAdminMessages,
  getAdminOrders,
  getApprovedProducts,
  getApprovedVendors,
  getPendingProducts,
  getPendingVendors,
  getRejectedProducts,
  getRejectedVendors
} from "@/lib/queries";
import type { Product, Vendor } from "@/lib/types";
import { requireAdminPage } from "@/lib/admin-auth";

const orderStages = ["placed", "confirmed", "packed", "in-transit", "delivered"] as const;

export default async function AdminDashboard() {
  const admin = await requireAdminPage();
  const [approvedVendors, pendingVendors, rejectedVendors, approvedProducts, pendingProducts, rejectedProducts, orders, messages] = await Promise.all([
    getApprovedVendors(),
    getPendingVendors(),
    getRejectedVendors(),
    getApprovedProducts(),
    getPendingProducts(),
    getRejectedProducts(),
    getAdminOrders(),
    getAdminMessages()
  ]);

  const allVendors = [...approvedVendors, ...pendingVendors, ...rejectedVendors];
  const allProducts = [...approvedProducts, ...pendingProducts, ...rejectedProducts];
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrder = orders.length ? Math.round(revenue / orders.length) : 0;
  const reviewLoad = pendingVendors.length + pendingProducts.length;
  const vendorApprovalRate = percentage(approvedVendors.length, allVendors.length);
  const listingApprovalRate = percentage(approvedProducts.length, allProducts.length);
  const trustScore = allVendors.length || allProducts.length ? Math.round((vendorApprovalRate + listingApprovalRate) / 2) : 0;
  const categories = buildCategoryStats(allProducts);
  const recentOrders = orders.slice(0, 5);
  const revenueData = buildRevenueData(orders);
  const orderStatusData = orderStages.map((stage) => ({ name: stage.replace("-", " "), value: orders.filter((order) => order.status === stage).length }));
  const reviewData = [
    { name: "Approved", value: approvedVendors.length + approvedProducts.length },
    { name: "Pending", value: pendingVendors.length + pendingProducts.length },
    { name: "Rejected", value: rejectedVendors.length + rejectedProducts.length }
  ];
  const categoryChartData = categories.map((category) => ({ name: category.name, value: category.count }));
  const newMessages = messages.filter((message) => message.status === "new");

  return (
    <main className="admin-shell">
      <div className="admin-workspace">
        <AdminSidebar />

        <section className="grid gap-5">
          <AdminTopbar />
          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
            <div className="admin-card relative overflow-hidden p-7 md:p-8">
              <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-[#6C3CF0]/10 blur-3xl" />
              <div className="relative flex flex-wrap items-start justify-between gap-6">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full bg-[#F3EEFF] px-4 py-2 text-sm font-extrabold text-[#6C3CF0]">
                    <Sparkles size={16} />
                    Admin command center
                  </p>
                  <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">Welcome back, {firstName(admin.fullName)}.</h1>
                  <p className="mt-4 max-w-2xl text-base font-semibold leading-8 text-[#6B7280]">
                    Review marketplace trust, vendor applications, product submissions, orders, and messages without changing the database structure behind AduraMart.
                  </p>
                </div>
                <div className="grid min-w-64 gap-3 rounded-[26px] bg-[#111111] p-4 text-white shadow-2xl shadow-black/10">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/55">Today&apos;s queue</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <QueuePill label="Vendors" value={pendingVendors.length} />
                    <QueuePill label="Listings" value={pendingProducts.length} />
                    <QueuePill label="Messages" value={newMessages.length} />
                  </div>
                  <Link href="/admin/products" className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#6C3CF0] px-4 py-3 text-sm font-black text-white transition hover:bg-[#5b2fe0]">
                    Start review
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            <aside className="admin-card grid gap-4 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-[#6C3CF0]">Pulse</p>
                  <h2 className="mt-1 text-2xl font-black">Marketplace health</h2>
                </div>
                <TrendingUp className="text-[#22C55E]" />
              </div>
              <HealthLine label="Vendor approval" value={vendorApprovalRate} />
              <HealthLine label="Listing approval" value={listingApprovalRate} />
              <HealthLine label="Trust score" value={trustScore} />
            </aside>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <DashboardMetric title="Revenue" value={formatNaira(revenue)} detail={`${orders.length} orders`} icon={<WalletCards />} tone="purple" />
            <DashboardMetric title="Average order" value={formatNaira(averageOrder)} detail="Buyer value" icon={<ShoppingBag />} tone="gold" />
            <DashboardMetric title="Review queue" value={String(reviewLoad)} detail="Needs action" icon={<BellRing />} tone="red" />
            <DashboardMetric title="Messages" value={String(messages.length)} detail={`${newMessages.length} unread`} icon={<MessageCircle />} tone="purple" />
            <DashboardMetric title="Trust score" value={`${trustScore}%`} detail="Approval health" icon={<ShieldCheck />} tone="green" />
          </section>

          <AdminCommerceCharts revenueData={revenueData} orderStatusData={orderStatusData} categoryData={categoryChartData} reviewData={reviewData} />

          <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
            <div className="admin-card">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-[#6C3CF0]">Recent orders</p>
                  <h2 className="mt-1 text-2xl font-black">Commerce activity</h2>
                </div>
                <Link href="/admin/analytics" className="rounded-full border border-[#dcd1ff] px-4 py-2 text-sm font-extrabold text-[#6C3CF0] transition hover:bg-[#F3EEFF]">Open analytics</Link>
              </div>
              <div className="mt-5 grid gap-3">
                {recentOrders.length ? recentOrders.map((order) => (
                  <div key={order.id} className="admin-data-row grid gap-3 md:grid-cols-[1fr_0.7fr_0.6fr_auto] md:items-center">
                    <div>
                      <p className="font-black">{order.customer}</p>
                      <p className="text-sm font-bold text-[#6B7280]">Order {order.id}</p>
                    </div>
                    <p className="text-sm font-extrabold capitalize text-[#6B7280]">{order.status.replace("-", " ")}</p>
                    <p className="text-sm font-extrabold text-[#6B7280]">{order.eta}</p>
                    <p className="font-black text-[#6C3CF0]">{formatNaira(order.total)}</p>
                  </div>
                )) : <EmptyState message="No live orders yet." />}
              </div>
            </div>

            <div className="admin-card">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-[#6C3CF0]">Notifications</p>
                  <h2 className="mt-1 text-2xl font-black">Needs attention</h2>
                </div>
                <BellRing className="text-[#6C3CF0]" />
              </div>
              <div className="mt-5 grid gap-3">
                <Notice icon={<UsersRound size={18} />} title={`${pendingVendors.length} vendor applications`} copy="Review identity, store details, and visibility before approval." href="/admin/vendors" />
                <Notice icon={<PackageSearch size={18} />} title={`${pendingProducts.length} product listings`} copy="Open each post and check all submitted product images." href="/admin/products" />
                <Notice icon={<MessageCircle size={18} />} title={`${newMessages.length} new messages`} copy="Buyer, vendor, and admin contact messages are collected here." href="/admin/messages" />
              </div>
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            <AdminModerationPanel
              title="Vendor approvals"
              type="vendors"
              rows={pendingVendors.map((vendor) => ({
                id: vendor.id,
                cells: [vendor.storeName, vendor.ownerName, vendor.category],
                detailsHref: `/admin/vendors/${vendor.id}`
              }))}
            />
            <AdminModerationPanel
              title="Product review queue"
              type="products"
              rows={pendingProducts.map((product) => ({
                id: product.id,
                cells: [product.name, product.vendorName, product.category],
                detailsHref: `/admin/products/${product.id}`
              }))}
            />
          </section>
        </section>
      </div>
    </main>
  );
}

function DashboardMetric({ title, value, detail, icon, tone }: { title: string; value: string; detail: string; icon: React.ReactNode; tone: "purple" | "gold" | "green" | "red" }) {
  const tones = {
    purple: "bg-[#F3EEFF] text-[#6C3CF0]",
    gold: "bg-[#FFF1DF] text-[#B96312]",
    green: "bg-[#EAFBF1] text-[#16803E]",
    red: "bg-[#fff1f1] text-[#EF4444]"
  };

  return (
    <article className="admin-metric-card">
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold text-[#6B7280]">{title}</p>
          <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[#9CA3AF]">{detail}</p>
        </div>
        <span className={`grid size-12 place-items-center rounded-2xl ${tones[tone]}`}>{icon}</span>
      </div>
    </article>
  );
}

function QueuePill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-white/55">{label}</p>
    </div>
  );
}

function HealthLine({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-black">
        <span>{label}</span>
        <span className="text-[#6C3CF0]">{value}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[#F3EEFF]">
        <div className="h-full rounded-full bg-[#111111]" style={{ width: `${Math.max(value, 3)}%` }} />
      </div>
    </div>
  );
}

function Notice({ icon, title, copy, href }: { icon: React.ReactNode; title: string; copy: string; href: string }) {
  return (
    <Link href={href} className="admin-data-row flex gap-3 transition hover:-translate-y-0.5 hover:border-[#6C3CF0]/30">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#F3EEFF] text-[#6C3CF0]">{icon}</span>
      <span>
        <span className="block font-black">{title}</span>
        <span className="mt-1 block text-sm font-bold leading-6 text-[#6B7280]">{copy}</span>
      </span>
    </Link>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="admin-data-row text-sm font-bold text-[#6B7280]">{message}</div>;
}

function buildRevenueData(orders: { id: string; total: number }[]) {
  const points = orders.slice(0, 8).reverse().map((order) => ({ name: order.id, revenue: order.total }));
  return points.length ? points : [{ name: "No orders", revenue: 0 }];
}

function buildCategoryStats(products: Product[]) {
  const counts = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] ?? 0) + 1;
    return acc;
  }, {});

  const entries: [string, number][] = Object.entries(counts).length ? Object.entries(counts) : [["No products yet", 0]];
  const max = Math.max(...entries.map(([, count]) => count), 1);

  return entries
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count, width: Math.max(8, percentage(count, max)) }));
}

function percentage(value: number, total: number) {
  if (!total) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || "Admin";
}