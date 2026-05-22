import { VendorDashboardFrame } from "@/components/vendor-dashboard-frame";
import { SubmitListingForm } from "@/components/vendor-dashboard-widgets";
import { requireVendorDashboard } from "@/lib/vendor-auth";

type Props = {
  searchParams?: Promise<{ product?: string }>;
};

const alerts: Record<string, string> = {
  "image-required": "Add at least one product photo before submitting.",
  "max-5-images": "You can upload a maximum of 5 product photos.",
  "upload-failed": "The product photos could not upload. Confirm the product-images storage bucket exists in Supabase, then try again.",
  "submit-failed": "The listing could not be submitted. Please try again.",
  "vendor-not-approved": "Only approved vendors can submit marketplace listings.",
  "not-authorized": "This vendor profile is not linked to your current login.",
  "not-configured": "Supabase is not configured for product submissions."
};

export default async function NewVendorProductPage({ searchParams }: Props) {
  const { vendor } = await requireVendorDashboard();
  const params = searchParams ? await searchParams : {};
  const message = params.product ? alerts[params.product] : null;

  return (
    <VendorDashboardFrame vendor={vendor} title="New Listing">
      <section className="grid gap-5">
        {message ? <div className="rounded-[22px] border border-[#ffd1d1] bg-[#fff1f1] p-4 text-sm font-extrabold text-[#EF4444]">{message}</div> : null}
        <SubmitListingForm vendor={vendor} canSubmitProducts={vendor.status === "approved"} />
      </section>
    </VendorDashboardFrame>
  );
}