import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Heart, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ProductGallery } from "@/components/product-gallery";
import { ProductCard } from "@/components/ui";
import { formatNaira } from "@/lib/data";
import { getApprovedProductById, getApprovedProducts } from "@/lib/queries";

export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getApprovedProductById(id);

  if (!product) {
    notFound();
  }

  const related = (await getApprovedProducts()).filter((item) => item.id !== product.id).slice(0, 3);

  return (
    <>
      <Nav />
      <main className="container py-10">
        <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <ProductGallery images={product.images} name={product.name} />

          <div className="card rounded-[24px] p-6 md:p-8">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#6C3CF0]">{product.category}</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">{product.name}</h1>
            <p className="mt-4 text-lg leading-8 text-[#6B7280]">{product.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href={`/vendor/${product.vendorId}`} className="rounded-full bg-[#F3EEFF] px-4 py-2 text-sm font-extrabold text-[#6C3CF0] transition hover:bg-[#ECE6FF]">{product.vendorName}</Link>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#EAFBF1] px-4 py-2 text-sm font-extrabold text-[#16803E]">
                <BadgeCheck size={17} />
                Verified
              </span>
            </div>
            <p className="mt-8 text-4xl font-black text-[#6C3CF0]">{formatNaira(product.price)}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                [ShieldCheck, "Verified vendor"],
                [Truck, "Delivery options"],
                [MessageCircle, "Store messaging"]
              ].map(([Icon, label]) => (
                <div key={label as string} className="rounded-2xl border border-[#ece6ff] bg-white p-4 text-sm font-extrabold">
                  <Icon className="mb-3 text-[#FFB86B]" />
                  {label as string}
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <AddToCartButton productId={product.id} />
              <Link href="/messages" className="inline-flex items-center gap-2 rounded-full border border-[#dcd1ff] bg-white px-6 py-3 font-extrabold">
                <MessageCircle size={18} />
                Message vendor
              </Link>
              <button aria-label="Save product" className="grid size-12 place-items-center rounded-full border border-[#dcd1ff] bg-white">
                <Heart size={19} />
              </button>
            </div>
          </div>
        </section>
        <section className="mt-14">
          <h2 className="mb-5 text-2xl font-black">Recommended for you</h2>
          {related.length ? (
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <ProductCard product={item} key={item.id} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#ece6ff] bg-white p-6 text-sm font-bold text-[#6B7280]">No other approved products yet.</div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
