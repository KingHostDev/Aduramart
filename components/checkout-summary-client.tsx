"use client";

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

export function CheckoutSummaryClient({ products }: { products: Product[] }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    setLines(readCart());
  }, []);

  const items = useMemo(() => {
    return lines
      .map((line) => {
        const product = products.find((item) => item.id === line.productId);
        return product ? { product, quantity: Math.max(1, line.quantity) } : null;
      })
      .filter((item): item is { product: Product; quantity: number } => Boolean(item));
  }, [lines, products]);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal ? subtotal + deliveryEstimate : 0;

  return (
    <aside className="card h-fit rounded-[24px] p-6">
      <h2 className="text-2xl font-black">Confirmation preview</h2>
      <p className="mt-4 text-sm leading-7 text-[#6B7280]">After successful payment, AduraMart creates an order record, notifies vendors, and enables tracking.</p>
      <div className="mt-6 grid gap-3 rounded-2xl bg-[#F3EEFF] p-5 text-sm font-bold">
        {items.length ? (
          items.map(({ product, quantity }) => (
            <div key={product.id} className="flex justify-between gap-4">
              <span className="text-[#6B7280]">{product.name} x {quantity}</span>
              <span>{formatNaira(product.price * quantity)}</span>
            </div>
          ))
        ) : (
          <p className="text-[#6B7280]">No cart items found.</p>
        )}
        <div className="flex justify-between border-t border-[#dcd1ff] pt-3">
          <span className="text-[#6B7280]">Delivery</span>
          <span>{subtotal ? formatNaira(deliveryEstimate) : formatNaira(0)}</span>
        </div>
        <div>
          <p className="text-sm font-bold text-[#6B7280]">Total payable</p>
          <p className="mt-2 text-4xl font-black text-[#6C3CF0]">{formatNaira(total)}</p>
        </div>
      </div>
    </aside>
  );
}
