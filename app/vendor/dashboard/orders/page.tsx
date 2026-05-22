import { VendorDashboardFrame } from "@/components/vendor-dashboard-frame";
import { EmptyState } from "@/components/vendor-dashboard-widgets";
import { formatNaira } from "@/lib/data";
import { getVendorOrders } from "@/lib/queries";
import { requireVendorDashboard } from "@/lib/vendor-auth";

export default async function VendorOrdersPage() {
  const { vendor } = await requireVendorDashboard();
  const orders = await getVendorOrders(vendor.id);
  return <VendorDashboardFrame vendor={vendor} title="Orders"><section className="card rounded-[22px] p-6"><h1 className="text-3xl font-black">Orders</h1><div className="mt-5 grid gap-3">{orders.length ? orders.map((order) => <div key={order.id} className="grid gap-3 rounded-2xl bg-white p-4 md:grid-cols-[1fr_auto_auto]"><div><p className="font-black">{order.id}</p><p className="text-sm text-[#6B7280]">{order.customer}</p></div><p className="font-black">{formatNaira(order.total)}</p><span className="rounded-full bg-[#F3EEFF] px-3 py-1 text-xs font-extrabold capitalize text-[#6C3CF0]">{order.status.replace("-", " ")}</span></div>) : <EmptyState title="No orders yet" copy="Orders connected to your vendor profile will appear here." />}</div></section></VendorDashboardFrame>;
}