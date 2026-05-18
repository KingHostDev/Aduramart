import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, MessageCircle, Phone } from "lucide-react";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ProductCard, StatCard } from "@/components/ui";
import { getApprovedProductsByVendorId, getApprovedVendorById } from "@/lib/queries";

export default async function VendorStorefront({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vendor = await getApprovedVendorById(id);

  if (!vendor) {
    notFound();
  }

  const storeProducts = await getApprovedProductsByVendorId(vendor.id);
  const whatsappHref = vendor.whatsapp ? `https://wa.me/${vendor.whatsapp.replace(/[^0-9]/g, "")}` : "/messages";

  return (
    <>
      <Nav />
      <main className="container py-10">
        <section className="card overflow-hidden rounded-[28px]">
          <div className="relative h-72">
            <Image src={vendor.banner} alt={vendor.storeName} fill className="object-cover" priority />
          </div>
          <div className="p-6 md:p-8">
            <div className="relative -mt-20 grid size-24 place-items-center overflow-hidden rounded-[24px] border-4 border-white bg-[#6C3CF0] text-2xl font-black text-white shadow-xl">
              {vendor.logoUrl ? <Image src={vendor.logoUrl} alt={`${vendor.storeName} logo`} fill className="object-cover" sizes="96px" /> : vendor.logo}
            </div>
            <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl font-black">{vendor.storeName}</h1>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#EAFBF1] px-4 py-2 text-sm font-extrabold text-[#16803E]">
                    <BadgeCheck size={17} />
                    Verified
                  </span>
                </div>
                <p className="mt-3 max-w-2xl leading-8 text-[#6B7280]">{vendor.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link href={whatsappHref} className="inline-flex items-center gap-2 rounded-full bg-[#22C55E] px-5 py-3 font-extrabold text-white">
                  <Phone size={18} />
                  WhatsApp
                </Link>
                <Link href="/messages" className="inline-flex items-center gap-2 rounded-full border border-[#dcd1ff] bg-white px-5 py-3 font-extrabold">
                  <MessageCircle size={18} />
                  Message
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard label="Store rating" value={`${vendor.rating}/5`} />
          <StatCard label="Completed sales" value={vendor.sales.toLocaleString()} tone="gold" />
          <StatCard label="Public status" value="Verified" tone="green" />
        </section>
        <section className="mt-12">
          <h2 className="mb-5 text-2xl font-black">Store listings</h2>
          {storeProducts.length ? (
            <div className="grid gap-6 md:grid-cols-3">
              {storeProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#ece6ff] bg-white p-6 text-sm font-bold text-[#6B7280]">This vendor has no approved listings yet.</div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
