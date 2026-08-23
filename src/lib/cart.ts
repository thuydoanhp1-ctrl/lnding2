import { CartItem } from "@/types";

export const CART_COOKIE_NAME = "cart";

/**
 * Parses cart items from raw cookie string
 */
export function parseCartCookie(cookieHeader: string | null | undefined): CartItem[] {
  if (!cookieHeader) return [];
  try {
    const items = JSON.parse(cookieHeader);
    if (Array.isArray(items)) {
      return items.filter(
        (item) => typeof item.variantId === "string" && typeof item.qty === "number" && item.qty > 0
      );
    }
  } catch {
    return [];
  }
  return [];
}

/**
 * Serializes cart items to cookie JSON string
 */
export function serializeCartCookie(items: CartItem[]): string {
  return JSON.stringify(items);
}
