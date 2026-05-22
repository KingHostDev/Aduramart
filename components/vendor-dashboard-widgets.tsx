import Link from "next/link";
import { CheckCircle2, Clock, CreditCard, PackagePlus, Settings, UserRound } from "lucide-react";
import {
  deleteVendorAccount,
  markVendorProductOutOfSale,
  removeVendorProduct,
  submitProductForReview,
  updateVendorPaymentSettings,
  updateVendorProfile
} from "@/lib/actions";
import { categories, formatNaira } from "@/lib/data";
import type { Product, Vendor } from "@/lib/types";
import { ProductImageUploader } from "./product-image-uploader";

export function ProductManagement({ products, canManageStore }: { products: Product[]; canManageStore: boolean }) {
  return (
    <div className="card rounded-[22px] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black">Product management</h2>
          <p className="mt-1 text-sm font-bold text-[#6B7280]">Create, edit, remove, and resubmit listings for admin review.</p>
        </div>
        <Link href="/vendor/dashboard/products/new" className="inline-flex items-center gap-2 rounded-full bg-[#6C3CF0] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-purple-500/20">
          <PackagePlus size={17} />
          New listing
        </Link>
      </div>
      <div className="mt-5 overflow-hidden rounded-2xl border border-[#ece6ff]">
        {products.length ? products.map((product) => (
          <div key={product.id} className="grid gap-3 border-b border-[#ece6ff] bg-white p-4 last:border-b-0 md:grid-cols-[1fr_auto]">
            <div>
              <p className="font-black">{product.name}</p>
              <p className="text-sm text-[#6B7280]">{product.category} - {formatNaira(product.price)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold ${product.status === "approved" ? "bg-[#EAFBF1] text-[#16803E]" : product.status === "pending" ? "bg-[#F3EEFF] text-[#6C3CF0]" : "bg-[#fff1f1] text-[#EF4444]"}`}>
                {product.status === "approved" ? <CheckCircle2 size={15} /> : <Clock size={15} />}{product.status}
              </span>
              {canManageStore ? <ProductActions product={product} /> : <Link href="/vendor/dashboard/messages" className="rounded-full border border-[#dcd1ff] bg-white px-3 py-1 text-xs font-extrabold text-[#6C3CF0]">Contact admin</Link>}
            </div>
          </div>
        )) : <div className="bg-white p-6"><EmptyState title="No products submitted" copy="Approved vendors can submit products for admin review from the new listing page." /></div>}
      </div>
    </div>
  );
}

function ProductActions({ product }: { product: Product }) {
  return (
    <>
      <Link href={`/vendor/products/${product.id}/edit`} className="rounded-full border border-[#dcd1ff] bg-white px-3 py-1 text-xs font-extrabold text-[#6C3CF0] hover:bg-[#F3EEFF]">Edit</Link>
      {product.status === "approved" ? (
        <form action={markVendorProductOutOfSale}><input type="hidden" name="productId" value={product.id} /><button className="rounded-full border border-[#dcd1ff] bg-white px-3 py-1 text-xs font-extrabold text-[#6C3CF0]">Out of sale</button></form>
      ) : null}
      <form action={removeVendorProduct}><input type="hidden" name="productId" value={product.id} /><button className="rounded-full border border-[#ffd1d1] bg-white px-3 py-1 text-xs font-extrabold text-[#EF4444]">Remove</button></form>
    </>
  );
}

export function SubmitListingForm({ vendor, canSubmitProducts }: { vendor: Vendor; canSubmitProducts: boolean }) {
  return (
    <form id="submit-listing" action={submitProductForReview} className="card rounded-[28px] p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3"><PackagePlus className="text-[#6C3CF0]" /><h2 className="text-3xl font-black">Submit product listing</h2></div>
          <p className="mt-2 max-w-2xl text-sm font-bold leading-7 text-[#6B7280]">Add clear product details and photos. Every listing goes to admin review before appearing in the marketplace.</p>
        </div>
        <span className="rounded-full bg-[#F3EEFF] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#6C3CF0]">Admin review</span>
      </div>
      <input type="hidden" name="vendorId" value={vendor.id} />
      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <input name="name" placeholder="Product name" disabled={!canSubmitProducts} required className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0] disabled:bg-[#F9FAFB]" />
        <select name="category" disabled={!canSubmitProducts} required className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0] disabled:bg-[#F9FAFB]">{categories.map((category) => <option key={category}>{category}</option>)}</select>
        <input name="price" type="number" placeholder="Price in naira" disabled={!canSubmitProducts} required className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0] disabled:bg-[#F9FAFB]" />
        <input name="stock" type="number" placeholder="Stock quantity" disabled={!canSubmitProducts} required className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0] disabled:bg-[#F9FAFB]" />
        <div className="md:col-span-2"><ProductImageUploader disabled={!canSubmitProducts} /></div>
        <textarea name="description" rows={5} placeholder="Product description" disabled={!canSubmitProducts} required className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0] disabled:bg-[#F9FAFB] md:col-span-2" />
      </div>
      <button disabled={!canSubmitProducts} className="mt-5 w-full rounded-full bg-[#6C3CF0] px-5 py-3 font-extrabold text-white disabled:bg-[#d8cef8]">{canSubmitProducts ? "Send to admin review" : "Awaiting admin approval"}</button>
    </form>
  );
}

export function VendorProfileForm({ vendor, canManageStore }: { vendor: Vendor; canManageStore: boolean }) {
  const selected = vendor.category.split(", ").map((item) => item.trim());
  return (
    <form action={updateVendorProfile} className="card rounded-[22px] p-6">
      <div className="flex items-center gap-3"><UserRound className="text-[#6C3CF0]" /><h2 className="text-2xl font-black">Vendor profile</h2></div>
      <p className="mt-2 text-sm font-bold leading-7 text-[#6B7280]">Edit your profile. Store name is locked after onboarding; request admin support to change it.</p>
      <input type="hidden" name="vendorId" value={vendor.id} />
      <label className="mt-5 grid gap-2 text-sm font-extrabold">Store name<input value={vendor.storeName} readOnly className="rounded-2xl border border-[#ece6ff] bg-[#F9FAFB] px-4 py-3 text-[#6B7280]" /></label>
      <Link href="/vendor/dashboard/messages?topic=store-name-change" className="mt-3 inline-flex rounded-full border border-[#dcd1ff] px-4 py-2 text-sm font-extrabold text-[#6C3CF0] hover:bg-[#F3EEFF]">Request store name change</Link>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <input name="ownerName" defaultValue={vendor.ownerName} placeholder="Owner name" disabled={!canManageStore} required className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none focus:border-[#6C3CF0] disabled:bg-[#F9FAFB]" />
        <input name="phone" defaultValue={vendor.phone} placeholder="Phone number" disabled={!canManageStore} className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none" />
        <input name="whatsapp" defaultValue={vendor.whatsapp} placeholder="WhatsApp contact" disabled={!canManageStore} className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none" />
        <input name="location" defaultValue={vendor.location} placeholder="Display location" disabled={!canManageStore} className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none" />
        <input name="address" defaultValue={vendor.address} placeholder="Store address" disabled={!canManageStore} className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none" />
        <input name="city" defaultValue={vendor.city} placeholder="City" disabled={!canManageStore} className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none" />
        <input name="state" defaultValue={vendor.state} placeholder="State" disabled={!canManageStore} className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none" />
        <input name="country" defaultValue={vendor.country || "Nigeria"} placeholder="Country" disabled={!canManageStore} className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none" />
      </div>
      <div className="mt-5 grid gap-2"><p className="text-sm font-extrabold">Categories you sell</p><div className="grid gap-2 sm:grid-cols-2">{categories.map((category) => (<label key={category} className="flex items-center gap-2 rounded-2xl border border-[#ece6ff] bg-white p-3 text-sm font-bold"><input type="checkbox" name="category" value={category} defaultChecked={selected.includes(category)} disabled={!canManageStore} />{category}</label>))}</div></div>
      <textarea name="description" rows={5} minLength={20} required disabled={!canManageStore} defaultValue={vendor.description} placeholder="Store bio" className="mt-5 w-full rounded-2xl border border-[#ece6ff] px-4 py-3 text-sm font-semibold leading-7 outline-none" />
      <button disabled={!canManageStore} className="mt-4 rounded-full bg-[#6C3CF0] px-5 py-3 font-extrabold text-white disabled:bg-[#d8cef8]">Save profile</button>
    </form>
  );
}

export function VendorPaymentSettings({ vendor }: { vendor: Vendor }) {
  return (
    <form action={updateVendorPaymentSettings} className="card rounded-[22px] p-6">
      <div className="flex items-center gap-3"><CreditCard className="text-[#6C3CF0]" /><h2 className="text-2xl font-black">Payment setup</h2></div>
      <p className="mt-2 text-sm font-bold leading-7 text-[#6B7280]">Add the bank account where AduraMart should settle vendor payouts.</p>
      <input type="hidden" name="vendorId" value={vendor.id} />
      <div className="mt-5 grid gap-3">
        <input name="bankName" defaultValue={vendor.paymentBankName} placeholder="Bank name" className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none" />
        <input name="accountName" defaultValue={vendor.paymentAccountName} placeholder="Account name" className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none" />
        <input name="accountNumber" defaultValue={vendor.paymentAccountNumber} placeholder="Account number" inputMode="numeric" className="rounded-2xl border border-[#ece6ff] px-4 py-3 outline-none" />
      </div>
      <button className="mt-4 rounded-full bg-[#6C3CF0] px-5 py-3 font-extrabold text-white">Save payout details</button>
    </form>
  );
}

export function VendorAccountSettings({ vendor }: { vendor: Vendor }) {
  return (
    <section className="card rounded-[22px] border border-[#fecaca] p-6">
      <div className="flex items-center gap-3"><Settings className="text-[#EF4444]" /><h2 className="text-2xl font-black text-[#EF4444]">Account deletion</h2></div>
      <p className="mt-2 text-sm font-bold leading-7 text-[#6B7280]">This action permanently removes your vendor account and cannot be undone.</p>
      <form action={deleteVendorAccount} className="mt-5 grid gap-3"><input type="hidden" name="vendorId" value={vendor.id} /><input name="confirmation" placeholder="Type DELETE to confirm" className="rounded-2xl border border-[#fecaca] px-4 py-3 text-sm font-semibold outline-none" /><button className="rounded-full bg-[#EF4444] px-5 py-3 font-extrabold text-white">Permanently delete my account</button></form>
    </section>
  );
}

export function EmptyState({ title, copy }: { title: string; copy: string }) {
  return <div className="rounded-2xl border border-[#ece6ff] bg-white p-5 text-sm font-bold leading-6 text-[#6B7280]"><p className="font-black text-[#1F1F1F]">{title}</p><p className="mt-2">{copy}</p></div>;
}