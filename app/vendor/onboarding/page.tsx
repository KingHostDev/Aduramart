import { BadgeCheck, FileCheck, IdCard, ImagePlus } from "lucide-react";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { VendorOnboardingForm } from "@/components/vendor-onboarding-form";

export default async function VendorOnboarding({ searchParams }: { searchParams: Promise<{ submitted?: string }> }) {
  const { submitted } = await searchParams;

  return (
    <>
      <Nav />
      <main className="container grid gap-8 py-12 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="soft-gradient h-fit rounded-[28px] p-8">
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#6C3CF0]">Vendor onboarding</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Apply to sell on AduraMart.</h1>
          <p className="mt-5 leading-8 text-[#6B7280]">Complete each section one at a time. Approved vendors become visible publicly, and every product listing is reviewed before marketplace display.</p>
          <div className="mt-8 grid gap-4">
            {[
              [IdCard, "Personal information"],
              [ImagePlus, "Identification upload"],
              [FileCheck, "Store details"],
              [BadgeCheck, "Admin approval"]
            ].map(([Icon, label]) => (
              <div key={label as string} className="glass flex items-center gap-3 rounded-2xl p-4 font-extrabold">
                <Icon className="text-[#6C3CF0]" />
                {label as string}
              </div>
            ))}
          </div>
        </section>

        <VendorOnboardingForm submitted={submitted} />
      </main>
      <Footer />
    </>
  );
}
