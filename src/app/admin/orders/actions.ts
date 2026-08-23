"use server";

import { requireAdmin } from "@/lib/auth-helpers";
import { fulfillOrder } from "@/lib/orders";
import { revalidatePath } from "next/cache";

export async function confirmOrderPaymentAction(orderId: string) {
  const admin = await requireAdmin();
  await fulfillOrder(orderId, admin.id);
  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
  return { success: true };
}
