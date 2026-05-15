import type { Order, Product, Vendor } from "./types";

export const categories = [
  "White Garments",
  "Candles",
  "Oils",
  "Spiritual Books",
  "Prayer Accessories",
  "Worship Materials"
];

export const vendors: Vendor[] = [
  {
    id: "seraph-light",
    storeName: "Seraph Light Vestments",
    ownerName: "Mariam Adebayo",
    category: "White Garments",
    location: "Lagos, Nigeria",
    rating: 4.9,
    verified: true,
    status: "approved",
    banner: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=1600&q=80",
    logo: "SL",
    description: "Hand-finished worship garments, caps, and choir robes for white garment communities.",
    whatsapp: "+2348012345678",
    sales: 1840
  },
  {
    id: "zion-oils",
    storeName: "Zion Oils & Candles",
    ownerName: "Tunde Omotoso",
    category: "Oils",
    location: "Ibadan, Nigeria",
    rating: 4.8,
    verified: true,
    status: "approved",
    banner: "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=1600&q=80",
    logo: "ZO",
    description: "Carefully packaged candles, olive oils, incense, and worship-ready altar materials.",
    whatsapp: "+2348098765432",
    sales: 1320
  },
  {
    id: "adura-books",
    storeName: "Adura Books House",
    ownerName: "Kemi Balogun",
    category: "Spiritual Books",
    location: "Abeokuta, Nigeria",
    rating: 4.7,
    verified: true,
    status: "approved",
    banner: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1600&q=80",
    logo: "AB",
    description: "Prayer guides, hymnals, church stationery, and devotional resources.",
    whatsapp: "+2348076543210",
    sales: 960
  },
  {
    id: "new-vendor-review",
    storeName: "Awaiting Grace Store",
    ownerName: "Blessing Cole",
    category: "Worship Materials",
    location: "Benin City, Nigeria",
    rating: 0,
    verified: false,
    status: "pending",
    banner: "https://images.unsplash.com/photo-1508020963102-c6c723be5764?auto=format&fit=crop&w=1600&q=80",
    logo: "AG",
    description: "Pending verification before public display.",
    whatsapp: "+2348000000000",
    sales: 0
  }
];

export const products: Product[] = [
  {
    id: "royal-white-robe",
    name: "Premium White Sutana Robe",
    vendorId: "seraph-light",
    vendorName: "Seraph Light Vestments",
    category: "White Garments",
    price: 28500,
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80",
    status: "approved",
    featured: true,
    description: "Soft, breathable ceremonial robe with refined stitching and a serene drape.",
    stock: 28
  },
  {
    id: "altar-candle-set",
    name: "Seven-Day Altar Candle Set",
    vendorId: "zion-oils",
    vendorName: "Zion Oils & Candles",
    category: "Candles",
    price: 7600,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80",
    status: "approved",
    featured: true,
    description: "Clean-burning candle set prepared for worship homes, retreats, and church services.",
    stock: 64
  },
  {
    id: "anointing-oil-case",
    name: "Anointing Oil Family Pack",
    vendorId: "zion-oils",
    vendorName: "Zion Oils & Candles",
    category: "Oils",
    price: 12400,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80",
    status: "approved",
    featured: false,
    description: "A sealed multi-bottle pack for prayer groups, family altars, and worship leaders.",
    stock: 42
  },
  {
    id: "daily-prayer-guide",
    name: "Daily Prayer Guide Journal",
    vendorId: "adura-books",
    vendorName: "Adura Books House",
    category: "Spiritual Books",
    price: 5400,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80",
    status: "approved",
    featured: true,
    description: "A practical devotional journal with prayer prompts, notes, and weekly reflections.",
    stock: 85
  },
  {
    id: "choir-bell",
    name: "Hand Bell for Procession",
    vendorId: "seraph-light",
    vendorName: "Seraph Light Vestments",
    category: "Prayer Accessories",
    price: 9200,
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80",
    status: "pending",
    featured: false,
    description: "Submitted by vendor and waiting for admin review before marketplace listing.",
    stock: 16
  }
];

export const orders: Order[] = [
  { id: "AM-24018", customer: "A. Johnson", total: 40900, status: "packed", eta: "Tomorrow" },
  { id: "AM-24017", customer: "T. Williams", total: 7600, status: "in-transit", eta: "Today" },
  { id: "AM-24016", customer: "M. Okafor", total: 28500, status: "delivered", eta: "Completed" }
];

export const formatNaira = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(amount);
