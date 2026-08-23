import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fulfillOrder } from "@/lib/orders";
import { env } from "@/lib/env";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-sepay-signature");

    // 1. Verify HMAC-SHA256 signature if secret is configured
    if (env.SEPAY_WEBHOOK_SECRET) {
      if (!signature) {
        return NextResponse.json({ error: "Missing webhook signature" }, { status: 401 });
      }

      const expectedSignature = crypto
        .createHmac("sha256", env.SEPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest("hex");

      if (signature !== expectedSignature) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const { content, amountIn } = payload;

    if (!content) {
      return NextResponse.json({ message: "No content in payload, ignored" }, { status: 200 });
    }

    // 2. Extract publicCode from transfer memo (e.g. "ORD-A7K9X2")
    const match = content.match(/ORD-[A-Z0-9]{6}/i);
    if (!match) {
      return NextResponse.json({ message: "No matching order code in transfer content" }, { status: 200 });
    }

    const publicCode = match[0].toUpperCase();

    // 3. Find pending order
    const order = await db.order.findUnique({
      where: { publicCode },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "paid") {
      return NextResponse.json({ message: "Order is already paid" }, { status: 200 });
    }

    // 4. Verify transferred amount matches order total
    if (amountIn && Number(amountIn) < order.total) {
      console.warn(`⚠️ Partial payment received for ${publicCode}: Received ${amountIn}, expected ${order.total}`);
      return NextResponse.json({ message: "Partial payment received" }, { status: 200 });
    }

    // 5. Fulfill order atomically
    await fulfillOrder(order.id);

    return NextResponse.json({
      success: true,
      message: `Order ${publicCode} confirmed and fulfilled successfully`,
    });
  } catch (err) {
    console.error("❌ Sepay Webhook Error:", err);
    return NextResponse.json({ error: "Internal webhook processing error" }, { status: 500 });
  }
}
