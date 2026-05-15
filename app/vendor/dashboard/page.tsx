import { BarChart3, Box, CheckCircle2, Clock, MessageCircle, PackagePlus, Settings, Truck } from "lucide-react";
import { Nav } from "@/components/nav";
import { StatCard } from "@/components/ui";
import { submitProductForReview } from "@/lib/actions";
import { categories, formatNaira, orders, products } from "@/lib/data";

export default function VendorDashboard() {
  const vendorProducts = products.filter((product) => product.vendorId === "seraph-light");

  return (
    <>
      <Nav />
      <main className="container grid gap-6 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="card h-fit rounded-[22px] p-4">
          {[
            [BarChart3, "Analytics"],
            [Box, "Products"],
            [Truck, "Orders"],
            [MessageCircle, "Messages"],
            [Settings, "Store settings"]
          ].map(([Icon, label]) => (
            <a key={label as string} href="#" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold hover:bg-[#F3EEFF]">
              <Icon size={18} className="text-[#6C3CF0]" />
              {label as string}
            </a>
          ))}
        </aside>
        <section className="grid gap-6">
          <div className="soft-gradient rounded-[28px] p-6 md:p-8">
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#6C3CF0]">Vendor dashboard</p>
            <h1 className="mt-3 text-4xl font-black">Seraph Light Vestments</h1>
            <p className="mt-3 max-w-2xl leading-8 text-[#6B7280]">Manage products, orders, messages, delivery settings, and store customization. New listings enter review before public marketplace display.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard label="Revenue" value={formatNaira(1840000)} />
            <StatCard label="Orders" value="184" tone="gold" />
            <StatCard label="Approved products" value="12" tone="green" />
            <StatCard label="Pending review" value="3" tone="dark" />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <div className="card rounded-[22px] p-6">
              <h2 className="text-2xl font-black">Product management</h2>
              <div className="mt-5 overflow-hidden rounded-2xl border border-[#ece6ff]">
                {vendorProducts.map((product) => (
                  <div key={product.id} className="grid gap-3 border-b border-[#ece6ff] bg-white p-4 last:border-b-0 md:grid-cols-[1fr_auto]">
                    <div>
                      <p className="font-black">{product.name}</p>
                      <p className="text-sm text-[#6B7280]">{product.category} · {formatNaira(product.price)}</p>
                    </div>
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold ${product.status === "approved" ? "bg-[#EAFBF1] text-[#16803E]" : "bg-[#FFF1DF] text-[#B96312]"}`}>
                      {product.status === "approved" ? <CheckCircle2 size={15} /> : <Clock size={15} />}
                      {product.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <form action={submitProductForReview} className="card rounded-[22px] p-6">
              <div className="flex items-center gap-3">
                <PackagePlus className="text-[#6C3CF0]" />
                <h2 className="text-2xl font-black">Submit listing</h2>
              </div>
              <input type="hidden" name="vendorId" value="seraph-light" />
              <div className="mt-5 grid gap-3">
                <input name="name" placeholder="Product name" className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0]" />
                <select name="category" className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0]">
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
                <input name="price" type="number" placeholder="Price in naira" className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0]" />
                <input name="stock" type="number" placeholder="Stock quantity" className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0]" />
                <input name="image" type="file" className="rounded-2xl border border-dashed border-[#cfc2ff] bg-[#F3EEFF] px-4 py-3 text-sm font-semibold" />
                <textarea name="description" rows={4} placeholder="Product description" className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0]" />
              </div>
              <button className="mt-4 w-full rounded-full bg-[#6C3CF0] px-5 py-3 font-extrabold text-white">Send to admin review</button>
            </form>
          </div>

          <div className="card rounded-[22px] p-6">
            <h2 className="text-2xl font-black">Recent orders</h2>
            <div className="mt-5 grid gap-3">
              {orders.map((order) => (
                <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4">
                  <div>
                    <p className="font-black">{order.id}</p>
                    <p className="text-sm text-[#6B7280]">{order.customer}</p>
                  </div>
                  <p className="font-black">{formatNaira(order.total)}</p>
                  <span className="rounded-full bg-[#F3EEFF] px-3 py-1 text-xs font-extrabold text-[#6C3CF0]">{order.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
