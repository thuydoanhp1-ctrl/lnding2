import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkoutSchema } from "@/lib/schemas";
import { generatePublicOrderCode, generatePaymentMemo } from "@/lib/orders";
import { validateAndApplyCoupon } from "@/lib/coupons";
import { getCurrentUser } from "@/lib/auth-helpers";
import { env } from "@/lib/env";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limit check
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const { success } = await checkRateLimit(`checkout:${ip}`, 5, "1 m");
    if (!success) {
      return NextResponse.json({ error: "Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút." }, { status: 429 });
    }

    // 2. Validate input schema
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dữ liệu không hợp lệ", details: parsed.error.format() }, { status: 400 });
    }

    const { buyerName, buyerEmail, buyerPhone, couponCode, referralCode, note, cartItems } = parsed.data;
    const user = await getCurrentUser();

    // 3. Fetch real prices from database server-side
    const variantIds = cartItems.map((item) => item.variantId);
    const variants = await db.productVariant.findMany({
      where: { id: { in: variantIds }, available: true },
      include: { product: true },
    });

    if (variants.length === 0) {
      return NextResponse.json({ error: "Sản phẩm trong giỏ không còn khả dụng" }, { status: 400 });
    }

    // Calculate subtotal
    let subtotal = 0;
    const orderItemData = [];

    for (const item of cartItems) {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) continue;

      const itemTotal = variant.price * item.qty;
      subtotal += itemTotal;

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

    // 4. Calculate coupon discount if provided
    let discount = 0;
    let validCouponCode: string | null = null;

    if (couponCode) {
      const couponRes = await validateAndApplyCoupon(couponCode, subtotal, user?.id);
      if (couponRes.valid) {
        discount = couponRes.discount;
        validCouponCode = couponRes.coupon?.code || null;
      }
    }

    const total = Math.max(0, subtotal - discount);

    // 5. Generate public codes and Sepay QR URL
    const publicCode = generatePublicOrderCode();
    const paymentMemo = generatePaymentMemo(publicCode, referralCode);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h expiry

    const qrUrl = `https://qr.sepay.vn/img?bank=${encodeURIComponent(env.SEPAY_BANK)}&acc=${encodeURIComponent(
      env.SEPAY_ACCOUNT
    )}&amount=${total}&des=${encodeURIComponent(paymentMemo)}`;

    // 6. Create Order in Database
    const order = await db.order.create({
      data: {
        publicCode,
        userId: user?.id || null,
        buyerName,
        buyerEmail,
        buyerPhone: buyerPhone || null,
        subtotal,
        discount,
        total,
        status: "pending",
        paymentMemo,
        expiresAt,
        couponCode: validCouponCode,
        referralCode: referralCode || null,
        ipAddress: ip,
        note: note || null,
        items: {
          create: orderItemData,
        },
      },
    });

    return NextResponse.json({
      publicCode: order.publicCode,
      paymentMemo: order.paymentMemo,
      total: order.total,
      qrUrl,
      expiresAt: order.expiresAt.toISOString(),
    });
  } catch (err) {
    console.error("❌ Checkout API Error:", err);
    return NextResponse.json({ error: "Lỗi hệ thống khi tạo đơn hàng" }, { status: 500 });
  }
}
