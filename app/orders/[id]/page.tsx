import { CheckCircle2, Circle, Package, Truck } from "lucide-react";
import { Nav } from "@/components/nav";
import { formatNaira, orders } from "@/lib/data";

export default async function OrderTracking({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = orders.find((item) => item.id === id) ?? orders[0];
  const steps = ["placed", "confirmed", "packed", "in-transit", "delivered"];
  const current = steps.indexOf(order.status);

  return (
    <>
      <Nav />
      <main className="container py-10">
        <section className="soft-gradient rounded-[28px] p-6 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#6C3CF0]">Order tracking</p>
              <h1 className="mt-3 text-4xl font-black">{order.id}</h1>
              <p className="mt-2 text-[#6B7280]">Estimated delivery: {order.eta}</p>
            </div>
            <div className="rounded-2xl bg-white/78 p-5">
              <p className="text-sm font-bold text-[#6B7280]">Order total</p>
              <p className="text-3xl font-black text-[#6C3CF0]">{formatNaira(order.total)}</p>
            </div>
          </div>
        </section>
        <section className="card mt-8 rounded-[24px] p-6">
          <div className="grid gap-4 md:grid-cols-5">
            {steps.map((step, index) => {
              const done = index <= current;
              return (
                <div key={step} className="rounded-2xl border border-[#ece6ff] bg-white p-4">
                  {done ? <CheckCircle2 className="text-[#22C55E]" /> : <Circle className="text-[#c7c1d9]" />}
                  <p className="mt-4 text-sm font-black capitalize">{step.replace("-", " ")}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-[#F3EEFF] p-5">
              <Package className="text-[#6C3CF0]" />
              <p className="mt-3 font-black">Vendor preparation</p>
              <p className="mt-1 text-sm text-[#6B7280]">Vendor confirms stock and prepares your package.</p>
            </div>
            <div className="rounded-2xl bg-[#FFF1DF] p-5">
              <Truck className="text-[#B96312]" />
              <p className="mt-3 font-black">Delivery partner</p>
              <p className="mt-1 text-sm text-[#6B7280]">Dispatch details appear here once the order leaves the store.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
