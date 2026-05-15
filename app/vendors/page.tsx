import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { SectionHeader, VendorCard } from "@/components/ui";
import { getApprovedVendors } from "@/lib/queries";

export default async function VendorsPage() {
  const vendors = await getApprovedVendors();

  return (
    <>
      <Nav />
      <main className="container py-12">
        <SectionHeader eyebrow="Verified vendors" title="Approved spiritual stores" copy="Only vendors approved by admin review appear on this page." />
        <div className="grid gap-6 md:grid-cols-3">
          {vendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
