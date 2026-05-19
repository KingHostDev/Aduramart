"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Flame, HeartHandshake, PackageCheck, Search, ShieldCheck, Sparkles, Store } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 }
};

export function MotionSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-90px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
    >
      {children}
    </motion.section>
  );
}

export function MotionItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={fadeUp} transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export function HomeHero() {
  return (
    <section className="adura-hero relative isolate overflow-hidden border-b border-white/70">
      <div className="absolute inset-0 -z-10 bg-[#EEE7FF]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,rgba(76,55,130,0.58),rgba(108,60,240,0.16)_44%,rgba(255,249,242,0.78)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 z-0 h-16 rounded-t-[56px] bg-white" />

      <div className="container relative z-10 grid min-h-[calc(100vh-80px)] items-center gap-10 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:py-0">
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }} className="max-w-2xl pb-8 pt-10 text-white lg:pt-0">
          <motion.div variants={fadeUp} transition={{ duration: 0.55 }} className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/16 px-4 py-2 text-sm font-bold shadow-sm backdrop-blur">
            <Sparkles size={16} />
            Trusted spiritual commerce for worship communities
          </motion.div>
          <motion.h1 variants={fadeUp} transition={{ duration: 0.68 }} className="mt-7 max-w-3xl text-4xl font-extrabold leading-[1.06] tracking-normal md:text-6xl">
            A calm marketplace for verified spiritual essentials.
          </motion.h1>
          <motion.p variants={fadeUp} transition={{ duration: 0.68 }} className="mt-6 max-w-xl text-base font-semibold leading-8 text-white/88 md:text-lg">
            Find approved vendors for garments, candles, oils, books, and worship materials in one peaceful place built around trust.
          </motion.p>
          <motion.div variants={fadeUp} transition={{ duration: 0.68 }} className="mt-8 flex flex-wrap gap-3">
            <Link href="/marketplace" className="inline-flex items-center gap-2 rounded-full bg-[#6C3CF0] px-6 py-3 text-sm font-extrabold text-white shadow-xl shadow-purple-900/20 transition hover:-translate-y-0.5 hover:bg-[#5c31dd]">
              Explore marketplace
              <ArrowRight size={17} />
            </Link>
            <Link href="/vendor/onboarding" className="inline-flex items-center gap-2 rounded-full border border-white/34 bg-white/18 px-6 py-3 text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/28">
              Become a vendor
              <Store size={17} />
            </Link>
          </motion.div>
          <motion.div variants={fadeUp} transition={{ duration: 0.68 }} className="mt-8 grid max-w-lg grid-cols-3 gap-3 text-white">
            {[
              ["Verified", "vendor profiles"],
              ["Reviewed", "product listings"],
              ["Nigeria+", "community reach"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-[18px] border border-white/22 bg-white/13 p-4 backdrop-blur">
                <p className="text-lg font-extrabold">{value}</p>
                <p className="mt-1 text-xs font-bold leading-5 text-white/72">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 36 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }} className="relative min-h-[480px] self-end lg:min-h-[650px]">
          <div className="absolute bottom-0 right-[-10%] h-[88%] w-[104%] overflow-hidden rounded-tl-[70px] bg-[#C9D4F7] shadow-2xl shadow-purple-950/16 md:right-[-4%]">
            <Image
              src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1400&q=88"
              alt="Premium white garments arranged for worship essentials"
              fill
              priority
              className="object-cover object-center opacity-95"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(51,39,95,0.24),rgba(255,255,255,0.02)_52%,rgba(255,249,242,0.24))]" />
          </div>

          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }} className="absolute left-2 top-20 max-w-[250px] rounded-[22px] border border-white/70 bg-white/78 p-4 shadow-2xl shadow-purple-950/12 backdrop-blur md:left-10">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-[#EAFBF1] text-[#22C55E]"><BadgeCheck size={20} /></span>
              <div>
                <p className="text-sm font-extrabold text-[#1F1F1F]">Verified vendor</p>
                <p className="text-xs font-bold text-[#6B7280]">ID, store, and listings reviewed</p>
              </div>
            </div>
          </motion.div>

          <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-24 right-1 w-[260px] rounded-[22px] border border-white/72 bg-white/84 p-4 shadow-2xl shadow-purple-950/14 backdrop-blur md:right-10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#6C3CF0]">Live marketplace</p>
                <p className="mt-2 text-xl font-extrabold text-[#1F1F1F]">Spiritual essentials</p>
              </div>
              <Flame className="text-[#FFB86B]" />
            </div>
            <div className="mt-4 flex gap-2 overflow-hidden text-xs font-extrabold text-[#6B7280]">
              {["Garments", "Oils", "Books"].map((item) => <span key={item} className="rounded-full bg-[#F3EEFF] px-3 py-1">{item}</span>)}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function MarketplacePulse() {
  const items = [
    [ShieldCheck, "Admin reviewed vendors"],
    [PackageCheck, "Products checked before listing"],
    [Search, "Clear discovery for buyers"],
    [HeartHandshake, "Human vendor connection"]
  ];

  return (
    <div className="relative overflow-hidden border-y border-[#ece6ff] bg-white/72 py-4">
      <div className="adura-marquee flex min-w-max gap-4">
        {[...items, ...items].map(([Icon, label], index) => (
          <div key={`${label}-${index}`} className="inline-flex items-center gap-2 rounded-full border border-[#ece6ff] bg-white px-5 py-3 text-sm font-extrabold text-[#454151] shadow-sm">
            <Icon size={17} className="text-[#6C3CF0]" />
            {label as string}
          </div>
        ))}
      </div>
    </div>
  );
}