"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";

const cartKey = "aduramart-cart";

type CartLine = {
  productId: string;
  quantity: number;
};

function readCart(): CartLine[] {
  if (typeof window === "undefined") {
    return [];
  }

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

export function AddToCartButton({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    const lines = readCart();
    const existing = lines.find((line) => line.productId === productId);

    if (existing) {
      existing.quantity += 1;
    } else {
      lines.push({ productId, quantity: 1 });
    }

    writeCart(lines);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <button type="button" onClick={addToCart} className="inline-flex items-center gap-2 rounded-full bg-[#6C3CF0] px-6 py-3 font-extrabold text-white shadow-lg shadow-purple-500/20 transition hover:bg-[#5b2fe0]">
      <ShoppingBag size={18} />
      {added ? "Added to cart" : "Add to cart"}
    </button>
  );
}
