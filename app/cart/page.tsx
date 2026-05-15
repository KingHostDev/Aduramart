import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Nav } from "@/components/nav";
import { formatNaira, products } from "@/lib/data";

export default function CartPage() {
  const items = products.filter((product) => product.status === "approved").slice(0, 3);
  const total = items.reduce((sum, product) => sum + product.price, 0);

  return (
    <>
      <Nav />
      <main className="container grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
        <section className="card rounded-[24px] p-6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-[#6C3CF0]" />
            <h1 className="text-3xl font-black">Your cart</h1>
          </div>
          <div className="mt-6 grid gap-4">
            {items.map((item) => (
              <div key={item.id} className="grid gap-4 rounded-2xl border border-[#ece6ff] bg-white p-4 md:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-black">{item.name}</p>
                  <p className="text-sm text-[#6B7280]">{item.vendorName}</p>
                  <p className="mt-2 font-black text-[#6C3CF0]">{formatNaira(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button aria-label="Decrease" className="grid size-10 place-items-center rounded-full bg-[#F3EEFF]"><Minus size={16} /></button>
                  <span className="grid size-10 place-items-center rounded-full bg-white font-black">1</span>
                  <button aria-label="Increase" className="grid size-10 place-items-center rounded-full bg-[#F3EEFF]"><Plus size={16} /></button>
                  <button aria-label="Remove" className="grid size-10 place-items-center rounded-full bg-[#fff1f1] text-[#EF4444]"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <aside className="card h-fit rounded-[24px] p-6">
          <h2 className="text-2xl font-black">Order summary</h2>
          <div className="mt-5 grid gap-3 text-sm font-bold">
            <div className="flex justify-between"><span className="text-[#6B7280]">Subtotal</span><span>{formatNaira(total)}</span></div>
            <div className="flex justify-between"><span className="text-[#6B7280]">Delivery estimate</span><span>{formatNaira(2500)}</span></div>
            <div className="flex justify-between border-t border-[#ece6ff] pt-3 text-lg"><span>Total</span><span>{formatNaira(total + 2500)}</span></div>
          </div>
          <Link href="/checkout" className="mt-6 block rounded-full bg-[#6C3CF0] px-6 py-4 text-center font-extrabold text-white">Proceed to checkout</Link>
        </aside>
      </main>
    </>
  );
}
