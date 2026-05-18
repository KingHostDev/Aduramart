import { Nav } from "@/components/nav";
import { CartClient } from "@/components/cart-client";
import { getApprovedProducts } from "@/lib/queries";

export default async function CartPage() {
  const products = await getApprovedProducts();

  return (
    <>
      <Nav />
      <CartClient products={products} />
    </>
  );
}
