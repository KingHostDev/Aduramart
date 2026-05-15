import { ArrowUpRight, BadgeCheck, MessageCircle, PackageCheck, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ButtonLink, ProductCard, SectionHeader, VendorCard } from "@/components/ui";
import { categories, products, vendors } from "@/lib/data";

const approvedProducts = products.filter((product) => product.status === "approved");
const approvedVendors = vendors.filter((vendor) => vendor.status === "approved");

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <section className="soft-gradient relative overflow-hidden pb-20 pt-12 md:pb-28">
          <div className="container grid items-center gap-12 lg:grid-cols-[1.04fr_0.96fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-4 py-2 text-sm font-extrabold text-[#6C3CF0] shadow-sm">
                <Sparkles size={16} />
                Verified spiritual marketplace for worship communities
              </div>
              <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[1.02] tracking-tight text-[#1F1F1F] md:text-7xl">
                Trusted spiritual essentials for your journey
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-9 text-[#5f6573]">
                Discover verified vendors selling garments, candles, oils, books, and worship materials in one calm, trusted marketplace built for Nigeria and beyond.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <ButtonLink href="/marketplace">Explore Marketplace</ButtonLink>
                <ButtonLink href="/vendor/onboarding" variant="light">Become a Vendor</ButtonLink>
              </div>
              <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
                {[
                  ["120+", "verified vendors"],
                  ["4.9/5", "trust rating"],
                  ["24h", "review window"]
                ].map(([value, label]) => (
                  <div key={label} className="glass rounded-[18px] p-4">
                    <p className="text-2xl font-black text-[#6C3CF0]">{value}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280]">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[600px]">
              <div className="glass absolute right-0 top-4 w-[82%] rounded-[28px] p-5">
                <div className="h-72 rounded-[22px] bg-[url('https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" />
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#6B7280]">Featured garment</p>
                    <p className="text-2xl font-black">Premium White Sutana</p>
                  </div>
                  <span className="rounded-full bg-[#6C3CF0] px-4 py-2 text-sm font-extrabold text-white">Reviewed</span>
                </div>
              </div>
              <div className="glass absolute bottom-10 left-0 w-[58%] rounded-[24px] p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#22C55E] text-white">
                    <BadgeCheck size={22} />
                  </span>
                  <div>
                    <p className="font-black">Vendor approved</p>
                    <p className="text-sm text-[#6B7280]">ID, selfie, store and products reviewed</p>
                  </div>
                </div>
              </div>
              <div className="glass absolute bottom-0 right-10 w-[46%] rounded-[24px] p-5">
                <p className="text-sm font-bold text-[#6B7280]">Live orders</p>
                <p className="mt-2 text-4xl font-black text-[#1F1F1F]">2,840+</p>
                <p className="mt-2 text-sm font-bold text-[#22C55E]">Secure checkout enabled</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <SectionHeader eyebrow="Marketplace" title="Everything worshippers need, curated with care" copy="A clean browsing experience for garments, prayer accessories, oils, candles, books, and worship materials." />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <a href="/marketplace" key={category} className="group rounded-[18px] border border-[#ece6ff] bg-white/78 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl font-black">{category}</h3>
                    <ArrowUpRight className="text-[#6C3CF0]" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#6B7280]">Verified listings from trusted stores and reviewed vendors.</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white/60 py-20">
          <div className="container">
            <SectionHeader eyebrow="Featured products" title="Reviewed spiritual essentials" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {approvedProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <SectionHeader eyebrow="Featured vendors" title="Trusted stores with verified profiles" />
            <div className="grid gap-6 md:grid-cols-3">
              {approvedVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white/60 py-20">
          <div className="container">
            <SectionHeader
              eyebrow="Testimonials"
              title="Built around real worship communities"
              copy="A marketplace experience shaped for people who value trust, clarity, and human connection."
            />
            <div className="grid gap-6 md:grid-cols-3">
              {[
                ["AduraMart makes it easier to find verified garment sellers without jumping from one social media page to another.", "Pastor Akin", "Lagos"],
                ["The review process gives our church members more confidence when ordering oils, candles, and worship items.", "Mother-in-Israel T. Adeyemi", "Ibadan"],
                ["As a vendor, I finally have a calm storefront that feels credible and organized for my buyers.", "Mariam Adebayo", "Vendor"]
              ].map(([quote, name, location]) => (
                <article key={name} className="card rounded-[18px] p-6">
                  <p className="text-lg font-bold leading-8 text-[#1F1F1F]">"{quote}"</p>
                  <div className="mt-6 border-t border-[#ece6ff] pt-5">
                    <p className="font-black">{name}</p>
                    <p className="text-sm font-bold text-[#6B7280]">{location}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#1F1F1F] py-20 text-white">
          <div className="container grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#FFB86B]">Why AduraMart</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Peaceful commerce, built around trust.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                [ShieldCheck, "Approval before visibility", "Vendors must be approved before appearing publicly."],
                [PackageCheck, "Product review queue", "Listings remain pending until admin moderation accepts them."],
                [MessageCircle, "Human vendor contact", "Buyers can message stores and continue on WhatsApp."],
                [UsersRound, "Community-driven growth", "Vendors move beyond social media limits into a trusted platform."]
              ].map(([Icon, title, copy]) => (
                <div key={title as string} className="rounded-[18px] border border-white/10 bg-white/7 p-6">
                  <Icon className="text-[#FFB86B]" />
                  <h3 className="mt-5 text-xl font-black">{title as string}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/68">{copy as string}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container grid items-center gap-10 rounded-[28px] bg-[#F3EEFF] p-8 md:grid-cols-[1fr_auto] md:p-12">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#6C3CF0]">Vendor invitation</p>
              <h2 className="mt-3 text-4xl font-black">Grow your spiritual store with verified trust.</h2>
              <p className="mt-4 max-w-2xl leading-8 text-[#6B7280]">Register your store, upload verification documents, submit products for review, and reach worshippers looking for authentic spiritual essentials.</p>
            </div>
            <ButtonLink href="/vendor/onboarding" variant="dark">Start onboarding</ButtonLink>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
