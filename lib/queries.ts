import { createAdminClient } from "./supabase/admin";
import { createClient } from "./supabase/server";
import type { AdminProfile, Order, Product, Vendor } from "./types";

type VendorRecord = {
  id: string;
  store_name: string;
  owner_name: string;
  email?: string | null;
  phone?: string | null;
  category: string;
  location: string;
  rating?: number | null;
  verified?: boolean | null;
  status: Vendor["status"];
  banner_url?: string | null;
  logo_url?: string | null;
  description?: string | null;
  whatsapp?: string | null;
  sales?: number | null;
  government_id_url?: string | null;
  selfie_url?: string | null;
};

type ProductRecord = {
  id: string;
  name: string;
  vendor_id: string;
  vendors?: { store_name?: string | null } | null;
  category: string;
  price: number;
  image_url?: string | null;
  status: Product["status"];
  featured?: boolean | null;
  description?: string | null;
  stock?: number | null;
};

type OrderRecord = {
  id: string;
  customer_name: string;
  total: number;
  status: Order["status"];
  delivery_method?: string | null;
  created_at?: string | null;
};

function mapVendor(vendor: VendorRecord): Vendor {
  return {
    id: vendor.id,
    storeName: vendor.store_name,
    ownerName: vendor.owner_name,
    email: vendor.email ?? "",
    phone: vendor.phone ?? "",
    category: vendor.category,
    location: vendor.location,
    rating: vendor.rating ?? 0,
    verified: vendor.verified ?? false,
    status: vendor.status,
    banner: vendor.banner_url ?? "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=1600&q=80",
    logo: vendor.store_name.slice(0, 2).toUpperCase(),
    logoUrl: vendor.logo_url ?? null,
    description: vendor.description ?? "",
    whatsapp: vendor.whatsapp ?? "",
    sales: vendor.sales ?? 0,
    governmentIdUrl: vendor.government_id_url ?? null,
    selfieUrl: vendor.selfie_url ?? null
  };
}

function mapProduct(product: ProductRecord): Product {
  return {
    id: product.id,
    name: product.name,
    vendorId: product.vendor_id,
    vendorName: product.vendors?.store_name ?? "Verified vendor",
    category: product.category,
    price: product.price,
    image: product.image_url ?? "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80",
    status: product.status,
    featured: product.featured ?? false,
    description: product.description ?? "",
    stock: product.stock ?? 0
  };
}

function mapOrder(order: OrderRecord): Order {
  return {
    id: order.id,
    customer: order.customer_name,
    total: order.total,
    status: order.status,
    eta: order.delivery_method ?? "Pending"
  };
}

async function getVendorsByStatus(status: Vendor["status"]): Promise<Vendor[]> {
  const supabase = createAdminClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map(mapVendor);
}

async function getProductsByStatus(status: Product["status"]): Promise<Product[]> {
  const supabase = createAdminClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("*, vendors(store_name)")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map(mapProduct);
}

export async function getApprovedVendors(): Promise<Vendor[]> {
  const supabase = await createClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map(mapVendor);
}

export async function getApprovedProducts(): Promise<Product[]> {
  const supabase = await createClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("*, vendors!inner(store_name,status)")
    .eq("status", "approved")
    .eq("vendors.status", "approved")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map(mapProduct);
}


export async function getApprovedVendorById(id: string): Promise<Vendor | null> {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("id", id)
    .eq("status", "approved")
    .single();

  if (error || !data) {
    return null;
  }

  return mapVendor(data);
}

export async function getApprovedProductsByVendorId(vendorId: string): Promise<Product[]> {
  const supabase = await createClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("*, vendors!inner(store_name,status)")
    .eq("vendor_id", vendorId)
    .eq("status", "approved")
    .eq("vendors.status", "approved")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map(mapProduct);
}

export async function getApprovedProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*, vendors!inner(store_name,status)")
    .eq("id", id)
    .eq("status", "approved")
    .eq("vendors.status", "approved")
    .single();

  if (error || !data) {
    return null;
  }

  return mapProduct(data);
}
export async function getPendingVendors(): Promise<Vendor[]> {
  return getVendorsByStatus("pending");
}

export async function getRejectedVendors(): Promise<Vendor[]> {
  return getVendorsByStatus("rejected");
}

export async function getHiddenVendors(): Promise<Vendor[]> {
  return getVendorsByStatus("hidden");
}

export async function getSuspendedVendors(): Promise<Vendor[]> {
  return getVendorsByStatus("suspended");
}

export async function getPendingProducts(): Promise<Product[]> {
  return getProductsByStatus("pending");
}

export async function getRejectedProducts(): Promise<Product[]> {
  return getProductsByStatus("rejected");
}

export async function getAdminOrders(): Promise<Order[]> {
  const supabase = createAdminClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("orders")
    .select("id, customer_name, total, status, delivery_method, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map(mapOrder);
}

export async function getAdminVendorById(id: string): Promise<Vendor | null> {
  const supabase = createAdminClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  const vendor = mapVendor(data);
  vendor.governmentIdUrl = await createSignedStorageUrl(vendor.governmentIdUrl);
  vendor.selfieUrl = await createSignedStorageUrl(vendor.selfieUrl);
  return vendor;
}

async function createSignedStorageUrl(url?: string | null) {
  if (!url) {
    return null;
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return url;
  }

  try {
    const parsed = new URL(url);
    const marker = "/storage/v1/object/public/";
    const markerIndex = parsed.pathname.indexOf(marker);

    if (markerIndex === -1) {
      return url;
    }

    const storagePath = decodeURIComponent(parsed.pathname.slice(markerIndex + marker.length));
    const [bucket, ...pathParts] = storagePath.split("/");
    const path = pathParts.join("/");

    if (!bucket || !path) {
      return url;
    }

    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 15);

    if (error || !data?.signedUrl) {
      return url;
    }

    return data.signedUrl;
  } catch {
    return url;
  }
}


export async function getAdminProfiles(): Promise<AdminProfile[]> {
  const supabase = createAdminClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, phone, created_at")
    .in("role", ["super_admin", "admin"])
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((profile) => ({
    id: profile.id,
    fullName: profile.full_name,
    role: profile.role,
    phone: profile.phone,
    createdAt: profile.created_at
  }));
}
