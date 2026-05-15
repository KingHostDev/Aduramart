import { Activity, BadgeCheck, Clock, PackageCheck, ShieldCheck, ShoppingBag, Store, TrendingUp } from "lucide-react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Nav } from "@/components/nav";
import { StatCard } from "@/components/ui";
import { formatNaira } from "@/lib/data";
import { getAdminOrders, getApprovedProducts, getApprovedVendors, getPendingProducts, getPendingVendors } from "@/lib/queries";

export default async function AdminAnalyticsPage() {
  const [approvedVendors, pendingVendors, approvedProducts, pendingProducts, orders] = await Promise.all([
    getApprovedVendors(),
    getPendingVendors(),
    getApprovedProducts(),
    getPendingProducts(),
    getAdminOrders()
  ]);

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((order) => order.status === "delivered").length;

  return (
    <>
      <Nav />
      <main className="container grid gap-6 py-8 lg:grid-cols-[260px_1fr]">
        <AdminSidebar />
        <section className="grid gap-6">
          <div className="soft-gradient rounded-[28px] p-6 md:p-8">
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#6C3CF0]">Analytics</p>
            <h1 className="mt-3 text-4xl font-black">Every part of AduraMart at a glance.</h1>
            <p className="mt-3 max-w-3xl leading-8 text-[#6B7280]">Track marketplace growth, vendor trust, listing moderation, order movement, and platform health from one admin page.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <StatCard label="Gross marketplace value" value={formatNaira(12450000)} />
            <StatCard label="Approved vendors" value={String(approvedVendors.length)} tone="green" />
            <StatCard label="Pending vendors" value={String(pendingVendors.length)} tone="gold" />
            <StatCard label="Pending listings" value={String(pendingProducts.length)} tone="dark" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              [Store, "Vendor pipeline", `${pendingVendors.length} vendors need review before appearing publicly. ${approvedVendors.length} vendors are approved and visible.`],
              [PackageCheck, "Product moderation", `${pendingProducts.length} listings are waiting for review. ${approvedProducts.length} products are currently live in the marketplace.`],
              [ShoppingBag, "Orders", `${totalOrders} tracked orders in the live order table, with ${deliveredOrders} delivered and the rest moving through fulfillment.`],
              [ShieldCheck, "Trust controls", "Vendor approval, product review, document checks, and rejection flows are active in the admin workflow."],
              [Clock, "Review speed", "Pending counts show how much approval work is waiting. Lower pending queues mean vendors can launch faster."],
              [TrendingUp, "Growth signal", "Vendor and product totals show marketplace depth, category coverage, and buyer discovery strength."]
            ].map(([Icon, title, copy]) => (
              <article key={title as string} className="card rounded-[18px] p-6">
                <Icon className="text-[#6C3CF0]" />
                <h2 className="mt-4 text-xl font-black">{title as string}</h2>
                <p className="mt-3 text-sm font-bold leading-7 text-[#6B7280]">{copy as string}</p>
              </article>
            ))}
          </div>

          <div className="card rounded-[22px] p-6">
            <div className="flex items-center gap-3">
              <Activity className="text-[#6C3CF0]" />
              <h2 className="text-2xl font-black">Operational checklist</h2>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {[
                "Review pending vendors and open their document page before approval.",
                "Moderate product submissions so only accepted listings appear in the marketplace.",
                "Watch order statuses for fulfillment delays and vendor response issues.",
                "Use reports to catch duplicate stores, unsafe listings, or buyer complaints.",
                "Keep review rules updated as categories and worship communities grow.",
                "Feature trusted vendors and products only after verification."
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-[#ece6ff] bg-white p-4 text-sm font-bold leading-7 text-[#454151]">
                  <BadgeCheck className="mb-3 text-[#22C55E]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
