import { Footer } from "@/components/footer";
import { MarketplaceBrowser } from "@/components/marketplace-browser";
import { Nav } from "@/components/nav";
import { getApprovedProducts, getApprovedVendors } from "@/lib/queries";

export default async function Marketplace() {
  const [products, approvedVendors] = await Promise.all([getApprovedProducts(), getApprovedVendors()]);

  return (
    <>
      <Nav />
      <main className="container py-10">
        <MarketplaceBrowser products={products} vendors={approvedVendors} />
      </main>
      <Footer />
    </>
  );
}
