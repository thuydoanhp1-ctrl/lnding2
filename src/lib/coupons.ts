import { db } from "./db";
import { Coupon, CouponType } from "@prisma/client";

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  discount: number;
  message?: string;
}

export async function validateAndApplyCoupon(
  code: string,
  subtotal: number,
  userId?: string
): Promise<CouponValidationResult> {
  const normalizedCode = code.trim().toUpperCase();
  const coupon = await db.coupon.findUnique({
    where: { code: normalizedCode },
  });

  if (!coupon || !coupon.active) {
    return { valid: false, discount: 0, message: "Mã giảm giá không tồn tại hoặc đã hết hiệu lực." };
  }

  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) {
    return { valid: false, discount: 0, message: "Mã giảm giá chưa đến thời gian áp dụng." };
  }
  if (coupon.expiresAt && coupon.expiresAt < now) {
    return { valid: false, discount: 0, message: "Mã giảm giá đã hết hạn." };
  }

  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return { valid: false, discount: 0, message: "Mã giảm giá đã đạt số lượt sử dụng tối đa." };
  }

  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      discount: 0,
      message: `Đơn hàng chưa đạt giá trị tối thiểu ${coupon.minOrderAmount.toLocaleString("vi-VN")}đ để dùng mã này.`,
    };
  }

  if (userId && coupon.perUserLimit) {
    const userUsages = await db.couponUsage.count({
      where: { couponId: coupon.id, userId },
    });
    if (userUsages >= coupon.perUserLimit) {
      return { valid: false, discount: 0, message: "Bạn đã dùng hết số lượt áp dụng cho mã này." };
    }
  }

  let discount = 0;
  if (coupon.type === CouponType.percent) {
    const rawDiscount = Math.floor((subtotal * coupon.value) / 100);
    discount = coupon.maxDiscount ? Math.min(rawDiscount, coupon.maxDiscount) : rawDiscount;
  } else {
    discount = Math.min(coupon.value, subtotal);
  }

  return {
    valid: true,
    coupon,
    discount,
    message: `Áp dụng thành công mã giảm ${coupon.code}!`,
  };
}
