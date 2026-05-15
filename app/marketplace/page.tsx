import { Filter, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ProductCard, VendorCard } from "@/components/ui";
import { categories, vendors } from "@/lib/data";
import { getApprovedProducts } from "@/lib/queries";

export default async function Marketplace() {
  const products = await getApprovedProducts();
  const approvedVendors = vendors.filter((vendor) => vendor.status === "approved");

  return (
    <>
      <Nav />
      <main className="container py-10">
        <section className="soft-gradient rounded-[28px] p-6 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/72 px-4 py-2 text-sm font-extrabold text-[#6C3CF0]">
                <Sparkles size={16} />
                Reviewed marketplace listings
              </p>
              <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">Browse with calm confidence.</h1>
              <p className="mt-5 max-w-2xl leading-8 text-[#6B7280]">Search spiritual essentials from verified stores. Products appear here only after admin review and acceptance.</p>
            </div>
            <div className="glass self-end rounded-[22px] p-4">
              <div className="flex flex-col gap-3 md:flex-row">
                <label className="flex flex-1 items-center gap-3 rounded-2xl bg-white px-4 py-3">
                  <Search size={19} className="text-[#6B7280]" />
                  <input placeholder="Search garments, oils, candles..." className="w-full border-0 bg-transparent outline-none" />
                </label>
                <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#6C3CF0] px-5 py-3 font-extrabold text-white">
                  <SlidersHorizontal size={18} />
                  Filter
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="card h-fit rounded-[18px] p-5">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-[#6C3CF0]" />
              <h2 className="font-black">Advanced filters</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {categories.map((category) => (
                <label key={category} className="flex items-center justify-between rounded-2xl border border-[#ece6ff] bg-white px-4 py-3 text-sm font-bold">
                  {category}
                  <input type="checkbox" className="accent-[#6C3CF0]" />
                </label>
              ))}
            </div>
            <div className="mt-5 border-t border-[#ece6ff] pt-5">
              <p className="text-sm font-black">Price range</p>
              <input type="range" min="2000" max="50000" className="mt-4 w-full accent-[#6C3CF0]" />
              <div className="mt-2 flex justify-between text-xs font-bold text-[#6B7280]">
                <span>₦2k</span>
                <span>₦50k+</span>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black">Featured and recommended</h2>
                <p className="text-sm text-[#6B7280]">{products.length} reviewed products available</p>
              </div>
              <select className="rounded-2xl border border-[#ece6ff] bg-white px-4 py-3 text-sm font-bold">
                <option>Sort by recommended</option>
                <option>Newest reviewed</option>
                <option>Price low to high</option>
              </select>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="mb-5 text-2xl font-black">Trending vendors</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {approvedVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
