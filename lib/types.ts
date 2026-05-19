export type ApprovalStatus = "pending" | "approved" | "rejected" | "hidden" | "suspended";
export type AdminRole = "super_admin" | "admin";
export type KycStatus = "not_configured" | "pending" | "verified" | "failed" | "manual_review";

export type AdminProfile = {
  id: string;
  fullName: string;
  role: AdminRole;
  phone?: string | null;
  createdAt?: string | null;
};

export type Vendor = {
  id: string;
  storeName: string;
  ownerName: string;
  email?: string;
  phone?: string;
  category: string;
  location: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  rating: number;
  likes: number;
  verified: boolean;
  status: ApprovalStatus;
  banner: string;
  logo: string;
  logoUrl?: string | null;
  description: string;
  whatsapp: string;
  sales: number;
  governmentIdUrl?: string | null;
  selfieUrl?: string | null;
  idType?: string | null;
  idNumber?: string | null;
  dateOfBirth?: string | null;
  kycStatus: KycStatus;
  kycProvider?: string | null;
  kycReference?: string | null;
  kycResult?: Record<string, unknown> | null;
};

export type Product = {
  id: string;
  name: string;
  vendorId: string;
  vendorName: string;
  category: string;
  price: number;
  image: string;
  status: ApprovalStatus;
  featured: boolean;
  description: string;
  stock: number;
};

export type Order = {
  id: string;
  customer: string;
  total: number;
  status: "placed" | "confirmed" | "packed" | "in-transit" | "delivered";
  eta: string;
};
