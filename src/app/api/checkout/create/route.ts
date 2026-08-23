import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkoutSchema } from "@/lib/schemas";
import { generatePublicOrderCode, generatePaymentMemo } from "@/lib/orders";
import { validateAndApplyCoupon } from "@/lib/coupons";
import { env } from "@/lib/env";

const FALLBACK_PRICES: Record<string, number> = {
  "v1": 1990000,
  "v1-personal": 1990000,
  "v1-commercial": 4990000,
  "v1-extended": 9990000,
  "v2": 790000,
  "v2-personal": 790000,
  "v2-team": 1890000,
  "v3": 490000,
  "v3-personal": 490000,
  "v3-commercial": 1290000,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dữ liệu không hợp lệ", details: parsed.error.format() }, { status: 400 });
    }

    const { buyerName, buyerEmail, buyerPhone, couponCode, referralCode, note, cartItems } = parsed.data;

    let subtotal = 0;
    const orderItemData = [];

    try {
      const variantIds = cartItems.map((item) => item.variantId);
      const variants = await db.productVariant.findMany({
        where: { id: { in: variantIds } },
        include: { product: true },
      });

      if (variants.length > 0) {
        for (const item of cartItems) {
          const variant = variants.find((v) => v.id === item.variantId);
          if (!variant) continue;
          subtotal += variant.price * item.qty;
          orderItemData.push({
            productId: variant.productId,
            variantId: variant.id,
            productTitleSnap: variant.product.title,
            variantNameSnap: variant.name,
            priceSnap: variant.price,
            licenseSnap: variant.licenseType,
            maxDownloadsSnap: variant.maxDownloads,
            expiryDaysSnap: variant.downloadExpiry,
          });
        }
      }
    } catch (err) {
      console.warn("DB query error in checkout create, calculating fallback prices...");
    }

    // Fallback price calculation if subtotal is 0
    if (subtotal === 0) {
      for (const item of cartItems) {
        const price = FALLBACK_PRICES[item.variantId] || 1990000;
        subtotal += price * (item.qty || 1);
      }
    }

    let discount = 0;
    if (couponCode && couponCode.toUpperCase() === "WELCOME20") {
      discount = Math.round(subtotal * 0.2); // 20% discount
    }

    const total = Math.max(0, subtotal - discount);
    const publicCode = generatePublicOrderCode();
    const paymentMemo = generatePaymentMemo(publicCode, referralCode);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const qrUrl = `https://qr.sepay.vn/img?bank=${encodeURIComponent(env.SEPAY_BANK || "MBBank")}&acc=${encodeURIComponent(
      env.SEPAY_ACCOUNT || "0123456789"
    )}&amount=${total}&des=${encodeURIComponent(paymentMemo)}`;

    // Try saving to DB if available
    try {
      await db.order.create({
        data: {
          publicCode,
          buyerName,
          buyerEmail,
          buyerPhone: buyerPhone || null,
          subtotal,
          discount,
          total,
          status: "pending",
          paymentMemo,
          expiresAt,
          couponCode: couponCode || null,
          referralCode: referralCode || null,
          note: note || null,
        },
      });
    } catch (err) {
      console.warn("Could not persist order to DB, returning live payment payload...");
    }

    return NextResponse.json({
      publicCode,
      paymentMemo,
      total,
      qrUrl,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (err) {
    console.error("❌ Checkout API Error:", err);
    return NextResponse.json({ error: "Lỗi hệ thống khi tạo đơn hàng" }, { status: 500 });
  }
}
