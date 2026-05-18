"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatNaira } from "@/lib/data";
import type { Product } from "@/lib/types";

const cartKey = "aduramart-cart";
const deliveryEstimate = 2500;

type CartLine = {
  productId: string;
  quantity: number;
};

function readCart(): CartLine[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(cartKey) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(lines: CartLine[]) {
  window.localStorage.setItem(cartKey, JSON.stringify(lines));
  window.dispatchEvent(new Event("aduramart-cart-updated"));
}

export function CartClient({ products }: { products: Product[] }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    const syncCart = () => setLines(readCart());
    syncCart();
    window.addEventListener("aduramart-cart-updated", syncCart);
    window.addEventListener("storage", syncCart);
    return () => {
      window.removeEventListener("aduramart-cart-updated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const items = useMemo(() => {
    return lines
      .map((line) => {
        const product = products.find((item) => item.id === line.productId);
        return product ? { product, quantity: Math.max(1, line.quantity) } : null;
      })
      .filter((item): item is { product: Product; quantity: number } => Boolean(item));
  }, [lines, products]);

  const updateQuantity = (productId: string, quantity: number) => {
    const nextLines = lines
      .map((line) => (line.productId === productId ? { ...line, quantity } : line))
      .filter((line) => line.quantity > 0);
    setLines(nextLines);
    writeCart(nextLines);
  };

  const removeItem = (productId: string) => {
    const nextLines = lines.filter((line) => line.productId !== productId);
    setLines(nextLines);
    writeCart(nextLines);
  };

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal ? subtotal + deliveryEstimate : 0;

  return (
    <main className="container grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
      <section className="card rounded-[24px] p-6">
        <div className="flex items-center gap-3">
          <ShoppingBag className="text-[#6C3CF0]" />
          <h1 className="text-3xl font-black">Your cart</h1>
        </div>
        <div className="mt-6 grid gap-4">
          {items.length ? (
            items.map(({ product, quantity }) => (
              <div key={product.id} className="grid gap-4 rounded-2xl border border-[#ece6ff] bg-white p-4 md:grid-cols-[1fr_auto]">
                <div>
                  <Link href={`/product/${product.id}`} className="font-black transition hover:text-[#6C3CF0]">{product.name}</Link>
                  <p className="text-sm text-[#6B7280]">{product.vendorName}</p>
                  <p className="mt-2 font-black text-[#6C3CF0]">{formatNaira(product.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" aria-label="Decrease" onClick={() => updateQuantity(product.id, quantity - 1)} className="grid size-10 place-items-center rounded-full bg-[#F3EEFF]"><Minus size={16} /></button>
                  <span className="grid size-10 place-items-center rounded-full bg-white font-black">{quantity}</span>
                  <button type="button" aria-label="Increase" onClick={() => updateQuantity(product.id, quantity + 1)} className="grid size-10 place-items-center rounded-full bg-[#F3EEFF]"><Plus size={16} /></button>
                  <button type="button" aria-label="Remove" onClick={() => removeItem(product.id)} className="grid size-10 place-items-center rounded-full bg-[#fff1f1] text-[#EF4444]"><Trash2 size={16} /></button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-[#ece6ff] bg-white p-6">
              <p className="font-black">Your cart is empty.</p>
              <p className="mt-2 text-sm font-bold leading-6 text-[#6B7280]">Add reviewed products from the live marketplace to see them here.</p>
              <Link href="/marketplace" className="mt-5 inline-flex rounded-full bg-[#6C3CF0] px-5 py-3 text-sm font-extrabold text-white">Explore marketplace</Link>
            </div>
          )}
        </div>
      </section>
      <aside className="card h-fit rounded-[24px] p-6">
        <h2 className="text-2xl font-black">Order summary</h2>
        <div className="mt-5 grid gap-3 text-sm font-bold">
          <div className="flex justify-between"><span className="text-[#6B7280]">Subtotal</span><span>{formatNaira(subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-[#6B7280]">Delivery estimate</span><span>{subtotal ? formatNaira(deliveryEstimate) : formatNaira(0)}</span></div>
          <div className="flex justify-between border-t border-[#ece6ff] pt-3 text-lg"><span>Total</span><span>{formatNaira(total)}</span></div>
        </div>
        <Link href={items.length ? "/checkout" : "/marketplace"} className="mt-6 block rounded-full bg-[#6C3CF0] px-6 py-4 text-center font-extrabold text-white">
          {items.length ? "Proceed to checkout" : "Start shopping"}
        </Link>
      </aside>
    </main>
  );
}
