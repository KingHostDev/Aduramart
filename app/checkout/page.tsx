import { CreditCard, Landmark, PackageCheck, Truck } from "lucide-react";
import { Nav } from "@/components/nav";
import { formatNaira, products } from "@/lib/data";

export default function CheckoutPage() {
  const total = products.filter((product) => product.status === "approved").slice(0, 3).reduce((sum, product) => sum + product.price, 2500);

  return (
    <>
      <Nav />
      <main className="container grid gap-8 py-10 lg:grid-cols-[1fr_380px]">
        <form className="card rounded-[24px] p-6 md:p-8">
          <h1 className="text-3xl font-black">Checkout</h1>
          <p className="mt-2 text-[#6B7280]">Guest checkout is available. Supabase Auth can attach orders to signed-in accounts.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {["Full name", "Email", "Phone", "Delivery city"].map((field) => (
              <input key={field} placeholder={field} className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0]" />
            ))}
            <textarea placeholder="Delivery address" rows={4} className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0] md:col-span-2" />
          </div>
          <h2 className="mt-8 text-xl font-black">Delivery selection</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {[[Truck, "Doorstep delivery"], [PackageCheck, "Pickup from vendor"]].map(([Icon, label]) => (
              <label key={label as string} className="flex items-center gap-3 rounded-2xl border border-[#ece6ff] bg-white p-4 font-extrabold">
                <input name="delivery" type="radio" className="accent-[#6C3CF0]" />
                <Icon className="text-[#6C3CF0]" />
                {label as string}
              </label>
            ))}
          </div>
          <h2 className="mt-8 text-xl font-black">Payment method</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[[CreditCard, "Paystack"], [Landmark, "Bank Transfer"], [PackageCheck, "Pay on Delivery"]].map(([Icon, label]) => (
              <label key={label as string} className="grid gap-3 rounded-2xl border border-[#ece6ff] bg-white p-4 font-extrabold">
                <input name="payment" type="radio" className="accent-[#6C3CF0]" />
                <Icon className="text-[#6C3CF0]" />
                {label as string}
              </label>
            ))}
          </div>
          <button className="mt-8 w-full rounded-full bg-[#6C3CF0] px-6 py-4 font-extrabold text-white">Place order securely</button>
        </form>
        <aside className="card h-fit rounded-[24px] p-6">
          <h2 className="text-2xl font-black">Confirmation preview</h2>
          <p className="mt-4 text-sm leading-7 text-[#6B7280]">After successful payment, AduraMart creates an order record, notifies vendors, and enables tracking.</p>
          <div className="mt-6 rounded-2xl bg-[#F3EEFF] p-5">
            <p className="text-sm font-bold text-[#6B7280]">Total payable</p>
            <p className="mt-2 text-4xl font-black text-[#6C3CF0]">{formatNaira(total)}</p>
          </div>
        </aside>
      </main>
    </>
  );
}
