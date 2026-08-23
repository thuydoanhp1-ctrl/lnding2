import crypto from "crypto";
import { db } from "./db";
import { OrderStatus, AuditAction, ReferralStatus } from "@prisma/client";
import { computeReferralCommission } from "./referral";
import { sendOrderConfirmationEmail } from "./email";
import { writeAuditLog } from "./audit";

/**
 * Generates a public order code (e.g. "ORD-A7K9X2")
 */
export function generatePublicOrderCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "ORD-";
  const bytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

/**
 * Generates payment memo for VietQR (e.g. "ORD-A7K9X2 REF88" max 25 chars for Sepay limit)
 */
export function generatePaymentMemo(publicCode: string, refCode?: string): string {
  if (refCode) {
    return `${publicCode} ${refCode}`.substring(0, 25);
  }
  return publicCode;
}

/**
 * Executes order fulfillment in a single atomic Prisma transaction
 */
export async function fulfillOrder(orderId: string, adminId?: string) {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              assetMappings: {
                include: {
                  asset: true,
                },
              },
            },
          },
        },
      },
      user: true,
    },
  });

  if (!order || order.status === OrderStatus.paid) {
    return order;
  }

  const now = new Date();

  // Run in single atomic transaction
  const updatedOrder = await db.$transaction(async (tx) => {
    // 1. Update order status to paid
    const updated = await tx.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.paid,
        paidAt: now,
        paidBy: adminId || null,
      },
    });

    // 2. Process each item: increment salesCount & create download tokens
    for (const item of order.items) {
      // Increment product sales count
      await tx.product.update({
        where: { id: item.productId },
        data: { salesCount: { increment: 1 } },
      });

      // Find assets mapped to this variant
      const assets = item.variant.assetMappings.map((m) => m.asset);

      for (const asset of assets) {
        const token = crypto.randomBytes(32).toString("hex");
        const expiryDays = item.variant.downloadExpiry || 365;
        const expiresAt = new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000);
        const maxDownloads = item.variant.maxDownloads ?? -1;

        await tx.downloadToken.create({
          data: {
            token,
            orderId: order.id,
            orderItemId: item.id,
            assetId: asset.id,
            maxDownloads,
            expiresAt,
          },
        });
      }
    }

    // 3. Process referral if present and not self-referral
    if (order.referralCode) {
      const referrer = await tx.user.findUnique({
        where: { referralCode: order.referralCode },
      });

      if (referrer && referrer.id !== order.userId && referrer.email !== order.buyerEmail) {
        const commission = computeReferralCommission(order.total);
        await tx.referral.create({
          data: {
            referrerId: referrer.id,
            referralCode: order.referralCode,
            orderId: order.id,
            buyerName: order.buyerName,
            buyerEmail: order.buyerEmail,
            buyerPhone: order.buyerPhone,
            amount: order.total,
            commission,
            status: ReferralStatus.pending,
          },
        });
      }
    }

    // 4. Update coupon usage count if coupon applied
    if (order.couponCode) {
      await tx.coupon.updateMany({
        where: { code: order.couponCode },
        data: { usageCount: { increment: 1 } },
      });
    }

    return updated;
  });

  // Write audit log
  await writeAuditLog({
    userId: adminId || order.userId || undefined,
    action: AuditAction.confirm,
    entityType: "Order",
    entityId: order.id,
    metadata: {
      publicCode: order.publicCode,
      total: order.total,
      paidAt: now.toISOString(),
      method: adminId ? "manual_admin" : "sepay_webhook",
    },
  });

  // Send confirmation email (fire-and-forget, does not block return)
  sendOrderConfirmationEmail(order).catch((err) => {
    console.error("❌ Failed to send confirmation email:", err);
  });

  return updatedOrder;
}
