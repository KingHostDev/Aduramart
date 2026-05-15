import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, Check, Plus, Star } from "lucide-react";
import { formatNaira } from "@/lib/data";
import type { Product, Vendor } from "@/lib/types";

export function ButtonLink({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "light" | "dark" }) {
  const styles = {
    primary: "bg-[#6C3CF0] text-white shadow-lg shadow-purple-500/25",
    light: "border border-[#dcd1ff] bg-white text-[#1f1f1f]",
    dark: "border border-[#dcd1ff] bg-white text-[#6C3CF0] hover:bg-[#F3EEFF]"
  };

  return (
    <Link href={href} className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold transition hover:-translate-y-0.5 ${styles[variant]}`}>
      {children}
      <ArrowRight size={17} />
    </Link>
  );
}

export function SectionHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#6C3CF0]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1F1F1F] md:text-5xl">{title}</h2>
      {copy ? <p className="mt-4 text-base leading-8 text-[#6B7280]">{copy}</p> : null}
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="group card overflow-hidden rounded-[18px] transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F3EEFF]">
        <Image src={product.image} alt={product.name} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
        {product.featured ? (
          <span className="absolute left-4 top-4 rounded-full bg-white/86 px-3 py-1 text-xs font-extrabold text-[#6C3CF0] backdrop-blur">Featured</span>
        ) : null}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3 text-xs font-bold text-[#6B7280]">
          <span>{product.category}</span>
          <span className="inline-flex items-center gap-1 text-[#22C55E]">
            <BadgeCheck size={14} />
            Verified
          </span>
        </div>
        <h3 className="mt-3 text-lg font-black leading-snug">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6B7280]">{product.description}</p>
        <div className="mt-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#6B7280]">{product.vendorName}</p>
            <p className="text-lg font-black text-[#6C3CF0]">{formatNaira(product.price)}</p>
          </div>
          <span className="grid size-11 place-items-center rounded-full bg-[#6C3CF0] text-white shadow-lg shadow-purple-500/20">
            <Plus size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link href={`/vendor/${vendor.id}`} className="card block rounded-[18px] transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10">
      <div className="relative h-36 overflow-visible rounded-t-[18px] bg-[#F3EEFF]">
        <div className="absolute inset-0 overflow-hidden rounded-t-[18px]">
          <Image src={vendor.banner} alt={vendor.storeName} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
        <div className="absolute -bottom-8 left-5 z-10 grid size-20 place-items-center overflow-hidden rounded-[22px] border-4 border-white bg-[#6C3CF0] text-xl font-black text-white shadow-xl shadow-purple-500/20">
          {vendor.logoUrl ? <Image src={vendor.logoUrl} alt={`${vendor.storeName} logo`} fill className="object-cover" sizes="80px" /> : vendor.logo}
        </div>
      </div>
      <div className="p-5 pt-12">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black">{vendor.storeName}</h3>
            <p className="mt-1 text-sm font-bold text-[#6B7280]">{vendor.location}</p>
          </div>
          {vendor.verified ? <BadgeCheck className="shrink-0 text-[#22C55E]" size={22} /> : null}
        </div>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#6B7280]">{vendor.description}</p>
        <div className="mt-5 flex items-center justify-between text-sm font-extrabold">
          <span className="inline-flex items-center gap-1 text-[#FFB86B]">
            <Star size={16} fill="currentColor" />
            {vendor.rating}
          </span>
          <span className="inline-flex items-center gap-2 text-[#22C55E]">
            <Check size={16} />
            Verified vendor
          </span>
        </div>
      </div>
    </Link>
  );
}

export function StatCard({ label, value, tone = "purple" }: { label: string; value: string; tone?: "purple" | "gold" | "green" | "dark" }) {
  const tones = {
    purple: "bg-[#F3EEFF] text-[#6C3CF0]",
    gold: "bg-[#FFF1DF] text-[#B96312]",
    green: "bg-[#EAFBF1] text-[#16803E]",
    dark: "bg-[#1F1F1F] text-white"
  };
  return (
    <div className="card rounded-[18px] p-5">
      <p className="text-sm font-bold text-[#6B7280]">{label}</p>
      <p className={`mt-4 inline-flex rounded-2xl px-4 py-2 text-2xl font-black ${tones[tone]}`}>{value}</p>
    </div>
  );
}