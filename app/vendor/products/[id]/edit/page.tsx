import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, PackageCheck } from "lucide-react";
import { Nav } from "@/components/nav";
import { updateVendorProductForReview } from "@/lib/actions";
import { categories, formatNaira } from "@/lib/data";
import { getVendorProductForUser } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

export default async function EditVendorProductPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const supabase = await createClient();

  if (!supabase) {
    redirect("/vendor-login?error=not-configured");
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    redirect("/vendor-login?error=login-required");
  }

  const { id } = await params;
  const { error } = await searchParams;
  const product = await getVendorProductForUser(id, user.id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Nav />
      <main className="container py-8">
        <Link href="/vendor/dashboard" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#6C3CF0]">
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="soft-gradient h-fit rounded-[28px] p-6 md:p-8">
            <span className="grid size-12 place-items-center rounded-2xl bg-white text-[#6C3CF0]">
              <PackageCheck size={22} />
            </span>
            <h1 className="mt-5 text-4xl font-black">Edit and resubmit listing.</h1>
            <p className="mt-3 leading-8 text-[#6B7280]">Changes return this product to admin review before buyers see the updated listing in the marketplace.</p>
            <div className="mt-6 overflow-hidden rounded-[22px] bg-white">
              <div className="relative aspect-[4/3] bg-[#F3EEFF]">
                <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 45vw" />
              </div>
              <div className="p-5">
                <p className="font-black">{product.name}</p>
                <p className="mt-1 text-sm font-bold text-[#6B7280]">Current price: {formatNaira(product.price)}</p>
                <p className="mt-1 text-sm font-bold capitalize text-[#6C3CF0]">Current status: {product.status}</p>
              </div>
            </div>
          </div>

          <form action={updateVendorProductForReview} className="card rounded-[24px] p-6 md:p-8">
            <h2 className="text-2xl font-black">Listing details</h2>
            <p className="mt-2 text-sm font-bold leading-7 text-[#6B7280]">Update the product details. Upload a new image only if you want to replace the current one.</p>
            {error ? <p className="mt-4 rounded-2xl bg-[#fff1f1] p-4 text-sm font-extrabold text-[#EF4444]">Unable to save: {error.replaceAll("-", " ")}</p> : null}
            <input type="hidden" name="productId" value={product.id} />

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-extrabold md:col-span-2">
                Product name
                <input name="name" required defaultValue={product.name} className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0]" />
              </label>
              <label className="grid gap-2 text-sm font-extrabold">
                Category
                <select name="category" required defaultValue={product.category} className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0]">
                  {categories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-extrabold">
                Price in naira
                <input name="price" type="number" min={0} required defaultValue={product.price} className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0]" />
              </label>
              <label className="grid gap-2 text-sm font-extrabold">
                Stock quantity
                <input name="stock" type="number" min={0} required defaultValue={product.stock} className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0]" />
              </label>
              <label className="grid gap-2 text-sm font-extrabold">
                Replace image
                <input name="image" type="file" accept="image/*" className="rounded-2xl border border-dashed border-[#cfc2ff] bg-[#F3EEFF] px-4 py-3 text-sm font-semibold" />
              </label>
              <label className="grid gap-2 text-sm font-extrabold md:col-span-2">
                Product description
                <textarea name="description" required rows={5} defaultValue={product.description} className="rounded-2xl border border-[#ece6ff] px-4 py-3 leading-7 outline-none focus:border-[#6C3CF0]" />
              </label>
            </div>
            <button className="mt-6 rounded-full bg-[#6C3CF0] px-6 py-3 font-extrabold text-white shadow-lg shadow-purple-500/20">
              Resubmit for admin approval
            </button>
          </form>
        </section>
      </main>
    </>
  );
}