import { Product, ProductVariant, Category, LicenseType, OrderStatus } from "@prisma/client";

export interface CartItem {
  variantId: string;
  qty: number;
}

export interface CartItemHydrated {
  variantId: string;
  qty: number;
  variant: ProductVariant;
  product: Product;
}

export interface ProductWithVariants extends Product {
  variants: ProductVariant[];
  category?: Category | null;
}

export interface CheckoutInput {
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  couponCode?: string;
  referralCode?: string;
  note?: string;
}

export interface OrderCreateResult {
  publicCode: string;
  paymentMemo: string;
  total: number;
  qrUrl: string;
  expiresAt: string;
}

export interface LicenseInfo {
  code: string;
  label: string;
  description: string;
}
