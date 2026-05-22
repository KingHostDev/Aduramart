import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  href: string;
  unread: boolean;
};

export async function GET() {
  const supabase = await createClient();
  const admin = createAdminClient();

  if (!supabase || !admin) {
    return NextResponse.json({ items: [], unreadCount: 0 });
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    return NextResponse.json({ items: [], unreadCount: 0 });
  }

  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";
  const items: NotificationItem[] = [];

  if (isAdmin) {
    const [pendingVendors, pendingProducts, newMessages, orders] = await Promise.all([
      countRows(admin.from("vendors").select("id", { count: "exact", head: true }).eq("status", "pending")),
      countRows(admin.from("products").select("id", { count: "exact", head: true }).eq("status", "pending")),
      countRows(admin.from("messages").select("id", { count: "exact", head: true }).eq("recipient_type", "admin").eq("status", "new")),
      countRows(admin.from("orders").select("id", { count: "exact", head: true }))
    ]);

    pushIf(items, pendingVendors, "pending-vendors", `${pendingVendors} vendor application${pendingVendors === 1 ? "" : "s"}`, "Review vendor identity and store details.", "/admin/vendors");
    pushIf(items, pendingProducts, "pending-products", `${pendingProducts} product listing${pendingProducts === 1 ? "" : "s"} waiting`, "Open the product review queue before marketplace display.", "/admin/products");
    pushIf(items, newMessages, "admin-messages", `${newMessages} unread admin message${newMessages === 1 ? "" : "s"}`, "Buyer and vendor support messages need attention.", "/admin/messages");
    pushIf(items, orders, "admin-orders", `${orders} total order${orders === 1 ? "" : "s"}`, "Track platform order activity from admin analytics.", "/admin/analytics");
  } else {
    const { data: vendor } = await admin.from("vendors").select("id, status").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle();

    if (vendor?.id) {
      const [newMessages, productReviews, orders] = await Promise.all([
        countRows(admin.from("messages").select("id", { count: "exact", head: true }).eq("recipient_type", "vendor").eq("recipient_id", vendor.id).eq("status", "new")),
        countRows(admin.from("products").select("id", { count: "exact", head: true }).eq("vendor_id", vendor.id).eq("status", "pending")),
        countRows(admin.from("order_items").select("id", { count: "exact", head: true }).eq("vendor_id", vendor.id))
      ]);

      pushIf(items, newMessages, "vendor-messages", `${newMessages} unread buyer/admin message${newMessages === 1 ? "" : "s"}`, "Open your vendor messages inside the dashboard.", "/vendor/dashboard/messages");
      pushIf(items, productReviews, "vendor-products", `${productReviews} listing${productReviews === 1 ? "" : "s"} in review`, "Admin is reviewing your submitted product posts.", "/vendor/dashboard/products");
      pushIf(items, orders, "vendor-orders", `${orders} order item${orders === 1 ? "" : "s"}`, "View buyer orders connected to your store.", "/vendor/dashboard/orders");

      if (vendor.status === "suspended") {
        items.unshift({ id: "vendor-suspended", title: "Account suspended", body: "Only admin contact is available until review is complete.", href: "/vendor/dashboard/messages?topic=suspension", unread: true });
      }
    }
  }

  return NextResponse.json({ items, unreadCount: items.filter((item) => item.unread).length });
}

async function countRows(query: PromiseLike<{ count: number | null; error: unknown }>) {
  const { count, error } = await query;
  return error ? 0 : count ?? 0;
}

function pushIf(items: NotificationItem[], count: number, id: string, title: string, body: string, href: string) {
  if (count > 0) {
    items.push({ id, title, body, href, unread: true });
  }
}