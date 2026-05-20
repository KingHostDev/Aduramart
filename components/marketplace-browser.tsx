"use client";

import { useMemo, useState } from "react";
import { Filter, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { ProductCard, VendorCard } from "@/components/ui";
import { categories, formatNaira } from "@/lib/data";
import type { Product, Vendor } from "@/lib/types";

type SortMode = "recommended" | "newest" | "price-asc" | "price-desc";

export function MarketplaceBrowser({ products, vendors }: { products: Product[]; vendors: Vendor[] }) {
  const highestPrice = Math.max(50000, ...products.map((product) => product.price));
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(highestPrice);
  const [sortMode, setSortMode] = useState<SortMode>("recommended");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products
      .filter((product) => {
        const productCategories = product.category.split(",").map((category) => category.trim());
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.some((category) => productCategories.includes(category));
        const matchesPrice = product.price <= maxPrice;
        const searchable = [product.name, product.vendorName, product.category, product.description].join(" ").toLowerCase();
        const matchesSearch = !normalizedQuery || searchable.includes(normalizedQuery);

        return matchesCategory && matchesPrice && matchesSearch;
      })
      .sort((first, second) => {
        if (sortMode === "price-asc") return first.price - second.price;
        if (sortMode === "price-desc") return second.price - first.price;
        if (sortMode === "newest") return second.id.localeCompare(first.id);
        return Number(second.featured) - Number(first.featured) || first.name.localeCompare(second.name);
      });
  }, [maxPrice, products, query, selectedCategories, sortMode]);

  const filteredVendors = useMemo(() => {
    if (!selectedCategories.length && !query.trim()) return vendors;

    const normalizedQuery = query.trim().toLowerCase();

    return vendors.filter((vendor) => {
      const vendorCategories = vendor.category.split(",").map((category) => category.trim());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.some((category) => vendorCategories.includes(category));
      const searchable = [vendor.storeName, vendor.ownerName, vendor.category, vendor.location, vendor.description].join(" ").toLowerCase();
      const matchesSearch = !normalizedQuery || searchable.includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [query, selectedCategories, vendors]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((current) => current.includes(category) ? current.filter((item) => item !== category) : [...current, category]);
  };

  const resetFilters = () => {
    setQuery("");
    setSelectedCategories([]);
    setMaxPrice(highestPrice);
    setSortMode("recommended");
  };

  return (
    <>
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
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search garments, oils, candles..."
                  className="w-full border-0 bg-transparent outline-none"
                />
              </label>
              <button type="button" onClick={resetFilters} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#6C3CF0] px-5 py-3 font-extrabold text-white transition hover:bg-[#5b2fe0]">
                <SlidersHorizontal size={18} />
                Reset
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
            {categories.map((category) => {
              const selected = selectedCategories.includes(category);
              return (
                <label key={category} className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-sm font-bold transition ${selected ? "border-[#6C3CF0] bg-[#F3EEFF] text-[#6C3CF0]" : "border-[#ece6ff] bg-white text-[#1F1F1F] hover:border-[#cfc1ff]"}`}>
                  {category}
                  <input checked={selected} onChange={() => toggleCategory(category)} type="checkbox" className="accent-[#6C3CF0]" />
                </label>
              );
            })}
          </div>
          <div className="mt-5 border-t border-[#ece6ff] pt-5">
            <p className="text-sm font-black">Price range</p>
            <input value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} type="range" min="2000" max={highestPrice} step="500" className="mt-4 w-full accent-[#6C3CF0]" />
            <div className="mt-2 flex justify-between text-xs font-bold text-[#6B7280]">
              <span>{formatNaira(2000)}</span>
              <span>{formatNaira(maxPrice)}</span>
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black">Featured and recommended</h2>
              <p className="text-sm text-[#6B7280]">{filteredProducts.length} of {products.length} reviewed products shown</p>
            </div>
            <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)} className="rounded-2xl border border-[#ece6ff] bg-white px-4 py-3 text-sm font-bold">
              <option value="recommended">Sort by recommended</option>
              <option value="newest">Newest reviewed</option>
              <option value="price-asc">Price low to high</option>
              <option value="price-desc">Price high to low</option>
            </select>
          </div>
          {filteredProducts.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="rounded-[22px] border border-[#ece6ff] bg-white p-8 text-center">
              <h3 className="text-xl font-black">No products found</h3>
              <p className="mt-2 text-sm font-semibold text-[#6B7280]">Try another search term, category, or price range.</p>
              <button type="button" onClick={resetFilters} className="mt-5 rounded-full bg-[#6C3CF0] px-5 py-3 text-sm font-extrabold text-white">Clear filters</button>
            </div>
          )}
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black">Trending vendors</h2>
            <p className="text-sm text-[#6B7280]">{filteredVendors.length} verified vendors match your browsing.</p>
          </div>
        </div>
        {filteredVendors.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {filteredVendors.map((vendor) => <VendorCard key={vendor.id} vendor={vendor} />)}
          </div>
        ) : (
          <div className="rounded-[22px] border border-[#ece6ff] bg-white p-8 text-center text-sm font-semibold text-[#6B7280]">No vendors match the current search.</div>
        )}
      </section>
    </>
  );
}
