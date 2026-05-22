import { ArrowUpRight, MessageCircle, PackageCheck, ShieldCheck, UsersRound } from "lucide-react";
import { Footer } from "@/components/footer";
import { HomeHero, MarketplacePulse, MotionItem, MotionSection } from "@/components/home-experience";
import { Nav } from "@/components/nav";
import { ButtonLink, ProductCard, SectionHeader, VendorCard } from "@/components/ui";
import { categories } from "@/lib/data";
import { getApprovedProducts, getApprovedVendors } from "@/lib/queries";

export default async function Home() {
  const [approvedProducts, approvedVendors] = await Promise.all([getApprovedProducts(), getApprovedVendors()]);

  return (
    <>
      <Nav />
      <main>
        <HomeHero />
        <MarketplacePulse />

        <MotionSection className="py-20">
          <div className="container">
            <MotionItem>
              <SectionHeader eyebrow="Marketplace" title="Everything worshippers need, curated with care" copy="A clean browsing experience for garments, prayer accessories, oils, candles, books, and worship materials." />
            </MotionItem>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <MotionItem key={category}>
                  <a href="/marketplace" className="group block rounded-[18px] border border-[#ece6ff] bg-white/78 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-xl font-extrabold">{category}</h3>
                      <ArrowUpRight className="text-[#6C3CF0] transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#6B7280]">Verified listings from trusted stores and reviewed vendors.</p>
                  </a>
                </MotionItem>
              ))}
            </div>
          </div>
        </MotionSection>

        <MotionSection className="bg-white/60 py-20">
          <div className="container">
            <MotionItem>
              <SectionHeader eyebrow="Featured products" title="Reviewed spiritual essentials" />
            </MotionItem>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {approvedProducts.slice(0, 4).map((product) => (
                <MotionItem key={product.id}>
                  <ProductCard product={product} />
                </MotionItem>
              ))}
            </div>
          </div>
        </MotionSection>

        <MotionSection className="py-20">
          <div className="container">
            <MotionItem>
              <SectionHeader eyebrow="Featured vendors" title="Trusted stores with verified profiles" />
            </MotionItem>
            <div className="grid gap-6 md:grid-cols-3">
              {approvedVendors.map((vendor) => (
                <MotionItem key={vendor.id}>
                  <VendorCard vendor={vendor} />
                </MotionItem>
              ))}
            </div>
          </div>
        </MotionSection>

        <MotionSection className="bg-white/60 py-20">
          <div className="container">
            <MotionItem>
              <SectionHeader
                eyebrow="Testimonials"
                title="Built around real worship communities"
                copy="A marketplace experience shaped for people who value trust, clarity, and human connection."
              />
            </MotionItem>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                ["AduraMart makes it easier to find verified garment sellers without jumping from one social media page to another.", "Pastor Akin", "Lagos"],
                ["The review process gives our church members more confidence when ordering oils, candles, and worship items.", "Mother-in-Israel T. Adeyemi", "Ibadan"],
                ["As a vendor, I finally have a calm storefront that feels credible and organized for my buyers.", "Mariam Adebayo", "Vendor"]
              ].map(([quote, name, location]) => (
                <MotionItem key={name}>
                  <article className="card rounded-[18px] p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10">
                    <p className="text-lg font-medium leading-8 text-[#1F1F1F]">"{quote}"</p>
                    <div className="mt-6 border-t border-[#ece6ff] pt-5">
                      <p className="font-black">{name}</p>
                      <p className="text-sm font-bold text-[#6B7280]">{location}</p>
                    </div>
                  </article>
                </MotionItem>
              ))}
            </div>
          </div>
        </MotionSection>

        <MotionSection className="bg-[#1F1F1F] py-20 text-white">
          <div className="container grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <MotionItem>
              <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#FFB86B]">Why AduraMart</p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-normal md:text-5xl">Peaceful commerce, built around trust.</h2>
            </MotionItem>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                [ShieldCheck, "Approval before visibility", "Vendors must be approved before appearing publicly."],
                [PackageCheck, "Product review queue", "Listings remain pending until admin moderation accepts them."],
                [MessageCircle, "Human vendor contact", "Buyers can message stores and continue on WhatsApp."],
                [UsersRound, "Community-driven growth", "Vendors move beyond social media limits into a trusted platform."]
              ].map(([Icon, title, copy]) => (
                <MotionItem key={title as string}>
                  <div className="rounded-[18px] border border-white/10 bg-white/7 p-6 transition hover:-translate-y-1 hover:bg-white/10">
                    <Icon className="text-[#FFB86B]" />
                    <h3 className="mt-5 text-xl font-extrabold">{title as string}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/68">{copy as string}</p>
                  </div>
                </MotionItem>
              ))}
            </div>
          </div>
        </MotionSection>

        <MotionSection className="py-20">
          <div className="container grid items-center gap-10 rounded-[28px] bg-[#F3EEFF] p-8 md:grid-cols-[1fr_auto] md:p-12">
            <MotionItem>
              <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#6C3CF0]">Vendor invitation</p>
              <h2 className="mt-3 text-4xl font-extrabold">Grow your spiritual store with verified trust.</h2>
              <p className="mt-4 max-w-2xl leading-8 text-[#6B7280]">Register your store, upload verification documents, submit products for review, and reach worshippers looking for authentic spiritual essentials.</p>
            </MotionItem>
            <MotionItem>
              <ButtonLink href="/vendor/onboarding" variant="dark">Start onboarding</ButtonLink>
            </MotionItem>
          </div>
        </MotionSection>
      </main>
      <Footer />
    </>
  );
}