import { NextRequest, NextResponse } from "next/server";
import { couponValidateSchema } from "@/lib/schemas";
import { validateAndApplyCoupon } from "@/lib/coupons";
import { getCurrentUser } from "@/lib/auth-helpers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = couponValidateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ valid: false, message: "Dữ liệu không hợp lệ" }, { status: 400 });
    }

    const { code, subtotal } = parsed.data;
    const user = await getCurrentUser();

    const result = await validateAndApplyCoupon(code, subtotal, user?.id);

    return NextResponse.json(result);
  } catch (err) {
    console.error("❌ Coupon Validation Error:", err);
    return NextResponse.json({ valid: false, message: "Lỗi kiểm tra mã giảm giá" }, { status: 500 });
  }
}
