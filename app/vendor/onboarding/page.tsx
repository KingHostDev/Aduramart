import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { VendorOnboardingForm } from "@/components/vendor-onboarding-form";

export default async function VendorOnboarding({ searchParams }: { searchParams: Promise<{ submitted?: string }> }) {
  const { submitted } = await searchParams;

  return (
    <>
      <Nav />
      <main className="bg-[#202020] px-3 py-8 md:px-6 md:py-12">
        <div className="container max-w-7xl">
          <VendorOnboardingForm submitted={submitted} />
        </div>
      </main>
      <Footer />
    </>
  );
}