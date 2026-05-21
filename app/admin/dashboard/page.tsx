import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  Boxes,
  CheckCircle2,
  Clock3,
  Eye,
  Landmark,
  MessageCircle,
  PackageCheck,
  PackageSearch,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  TrendingUp,
  UsersRound,
  WalletCards
} from "lucide-react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminCommerceCharts } from "@/components/admin-commerce-charts";
import { AdminModerationPanel } from "@/components/admin-moderation-panel";
import { Nav } from "@/components/nav";
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
  await requireAdminPage();
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
  const recentOrders = orders.slice(0, 4);
  const revenueData = buildRevenueData(orders);
  const orderStatusData = orderStages.map((stage) => ({ name: stage.replace("-", " "), value: orders.filter((order) => order.status === stage).length }));
  const reviewData = [
    { name: "Approved", value: approvedVendors.length + approvedProducts.length },
    { name: "Pending", value: pendingVendors.length + pendingProducts.length },
    { name: "Rejected", value: rejectedVendors.length + rejectedProducts.length }
  ];
  const categoryChartData = categories.map((category) => ({ name: category.name, value: category.count }));

  return (
    <>
      <Nav />
      <main className="container grid gap-6 py-8 lg:grid-cols-[280px_1fr]">
        <AdminSidebar />
        <section className="grid gap-6">
          <div className="relative overflow-hidden rounded-[30px] border border-[#e8ddff] bg-white p-6 shadow-2xl shadow-purple-500/10 md:p-8">
            <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(108,60,240,0.18),transparent_28rem)]" />
            <div className="relative grid gap-8 xl:grid-cols-[1fr_420px]">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-[#F3EEFF] px-4 py-2 text-sm font-extrabold text-[#6C3CF0]">
                  <Sparkles size={16} />
                  Admin command center
                </p>
                <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">Run AduraMart with calm, clear control.</h1>
                <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-[#6B7280]">
                  Monitor revenue, orders, vendors, product moderation, trust signals, and pending review work from the database-backed admin dashboard.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/admin/vendors" className="inline-flex items-center gap-2 rounded-full bg-[#6C3CF0] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-purple-500/20 transition hover:bg-[#5b2fe0]">
                    Review vendors
                    <ArrowRight size={17} />
                  </Link>
                  <Link href="/admin/products" className="inline-flex items-center gap-2 rounded-full border border-[#dcd1ff] bg-white px-5 py-3 text-sm font-extrabold text-[#6C3CF0] transition hover:bg-[#F3EEFF]">
                    Moderate products
                    <PackageSearch size={17} />
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 rounded-[24px] border border-[#ece6ff] bg-[#FFF9F2]/80 p-5">
                <MiniMetric label="Review load" value={String(reviewLoad)} note="vendors + listings waiting" icon={<Clock3 size={18} />} />
                <MiniMetric label="Live vendors" value={String(approvedVendors.length)} note={`${vendorApprovalRate}% approval health`} icon={<Store size={18} />} />
                <MiniMetric label="Live products" value={String(approvedProducts.length)} note={`${listingApprovalRate}% listing health`} icon={<Boxes size={18} />} />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <DashboardMetric title="Revenue" value={formatNaira(revenue)} detail={`${orders.length} orders captured`} icon={<WalletCards />} tone="purple" />
            <DashboardMetric title="Average order" value={formatNaira(averageOrder)} detail="Order value signal" icon={<ShoppingBag />} tone="gold" />
            <DashboardMetric title="Pending reviews" value={String(reviewLoad)} detail={`${pendingVendors.length} vendors, ${pendingProducts.length} listings`} icon={<BellRing />} tone="red" />
            <DashboardMetric title="Messages" value={String(messages.length)} detail={`${messages.filter((message) => message.status === "new").length} new inbox items`} icon={<MessageCircle />} tone="purple" />
            <DashboardMetric title="Trust score" value={`${trustScore}%`} detail="Verification + listing health" icon={<ShieldCheck />} tone="green" />
          </div>

          <AdminCommerceCharts revenueData={revenueData} orderStatusData={orderStatusData} categoryData={categoryChartData} reviewData={reviewData} />

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <section className="card rounded-[24px] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#6C3CF0]">Marketplace pulse</p>
                  <h2 className="mt-2 text-2xl font-black">Vendor and listing health</h2>
                </div>
                <Link href="/admin/analytics" className="rounded-full border border-[#dcd1ff] px-4 py-2 text-sm font-extrabold text-[#6C3CF0] transition hover:bg-[#F3EEFF]">Open analytics</Link>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <StatusBreakdown title="Vendor verification" approved={approvedVendors.length} pending={pendingVendors.length} rejected={rejectedVendors.length} />
                <StatusBreakdown title="Product moderation" approved={approvedProducts.length} pending={pendingProducts.length} rejected={rejectedProducts.length} />
              </div>
              <div className="mt-6 rounded-[20px] border border-[#ece6ff] bg-white p-5">
                <h3 className="font-black">Category coverage</h3>
                <div className="mt-4 grid gap-4">
                  {categories.map((category) => (
                    <div key={category.name}>
                      <div className="mb-2 flex items-center justify-between text-sm font-extrabold">
                        <span>{category.name}</span>
                        <span className="text-[#6B7280]">{category.count}</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-[#F3EEFF]">
                        <div className="h-full rounded-full bg-[#6C3CF0]" style={{ width: `${category.width}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="card rounded-[24px] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#6C3CF0]">Orders</p>
                  <h2 className="mt-2 text-2xl font-black">Fulfillment flow</h2>
                </div>
                <PackageCheck className="text-[#6C3CF0]" />
              </div>
              <div className="mt-6 grid gap-3">
                {orderStages.map((stage) => {
                  const count = orders.filter((order) => order.status === stage).length;
                  return (
                    <div key={stage} className="rounded-2xl border border-[#ece6ff] bg-white p-4">
                      <div className="flex items-center justify-between text-sm font-extrabold capitalize">
                        <span>{stage.replace("-", " ")}</span>
                        <span className="text-[#6C3CF0]">{count}</span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F3EEFF]">
                        <div className="h-full rounded-full bg-[#FFB86B]" style={{ width: `${percentage(count, Math.max(orders.length, 1))}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <section className="card rounded-[24px] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#6C3CF0]">Recent orders</p>
                  <h2 className="mt-2 text-2xl font-black">Revenue activity</h2>
                </div>
                <Landmark className="text-[#FFB86B]" />
              </div>
              <div className="mt-5 grid gap-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="grid gap-3 rounded-2xl border border-[#ece6ff] bg-white p-4 sm:grid-cols-[1fr_auto]">
                    <div>
                      <p className="font-black">{order.id}</p>
                      <p className="text-sm font-bold text-[#6B7280]">{order.customer} · <span className="capitalize">{order.status.replace("-", " ")}</span></p>
                    </div>
                    <p className="font-black text-[#6C3CF0]">{formatNaira(order.total)}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="card rounded-[24px] p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#6C3CF0]">Priority queue</p>
                  <h2 className="mt-2 text-2xl font-black">Needs admin attention</h2>
                </div>
                <Link href="/admin/messages" className="inline-flex items-center gap-2 rounded-full border border-[#dcd1ff] px-4 py-2 text-sm font-extrabold text-[#6C3CF0] transition hover:bg-[#F3EEFF]">
                  Open messages
                  <Eye size={16} />
                </Link>
              </div>
              <div className="mt-5 grid gap-3">
                {pendingVendors.slice(0, 3).map((vendor) => (
                  <PriorityVendor key={vendor.id} vendor={vendor} />
                ))}
                {pendingVendors.length === 0 ? <EmptyState message="No vendors waiting for approval." /> : null}
              </div>
            </section>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
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
                cells: [product.name, product.vendorName, product.category]
              }))}
            />
          </div>
        </section>
      </main>
    </>
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
    <article className="card rounded-[22px] p-5">
      <div className="flex items-start justify-between gap-4">
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

function MiniMetric({ label, value, note, icon }: { label: string; value: string; note: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
      <span className="grid size-11 place-items-center rounded-2xl bg-[#F3EEFF] text-[#6C3CF0]">{icon}</span>
      <div>
        <p className="text-sm font-extrabold text-[#6B7280]">{label}</p>
        <p className="text-2xl font-black">{value}</p>
        <p className="text-xs font-bold text-[#9CA3AF]">{note}</p>
      </div>
    </div>
  );
}

function StatusBreakdown({ title, approved, pending, rejected }: { title: string; approved: number; pending: number; rejected: number }) {
  const total = Math.max(approved + pending + rejected, 1);
  return (
    <div className="rounded-[20px] border border-[#ece6ff] bg-white p-5">
      <h3 className="font-black">{title}</h3>
      <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-[#F3EEFF]">
        <span className="bg-[#22C55E]" style={{ width: `${percentage(approved, total)}%` }} />
        <span className="bg-[#FFB86B]" style={{ width: `${percentage(pending, total)}%` }} />
        <span className="bg-[#EF4444]" style={{ width: `${percentage(rejected, total)}%` }} />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm font-extrabold">
        <div className="rounded-2xl bg-[#EAFBF1] p-3 text-[#16803E]"><CheckCircle2 className="mx-auto mb-1" size={16} />{approved} live</div>
        <div className="rounded-2xl bg-[#FFF1DF] p-3 text-[#B96312]"><Clock3 className="mx-auto mb-1" size={16} />{pending} pending</div>
        <div className="rounded-2xl bg-[#fff1f1] p-3 text-[#EF4444]"><BadgeCheck className="mx-auto mb-1" size={16} />{rejected} rejected</div>
      </div>
    </div>
  );
}

function PriorityVendor({ vendor }: { vendor: Vendor }) {
  return (
    <Link href={`/admin/vendors/${vendor.id}`} className="grid gap-3 rounded-2xl border border-[#ece6ff] bg-white p-4 transition hover:bg-[#F3EEFF]/50 sm:grid-cols-[1fr_auto]">
      <div>
        <p className="font-black">{vendor.storeName}</p>
        <p className="text-sm font-bold text-[#6B7280]">{vendor.ownerName} · {vendor.category}</p>
      </div>
      <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF1DF] px-3 py-2 text-xs font-extrabold text-[#B96312]">
        Review
        <ArrowRight size={14} />
      </span>
    </Link>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="rounded-2xl border border-[#ece6ff] bg-white p-5 text-sm font-bold text-[#6B7280]">{message}</div>;
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
