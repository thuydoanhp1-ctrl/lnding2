import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { parseCartCookie, CART_COOKIE_NAME } from "@/lib/cart";
import { getCurrentUser } from "@/lib/auth-helpers";
import { CheckoutForm } from "@/components/store/CheckoutForm";
import { Lock } from "lucide-react";

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const rawCart = cookieStore.get(CART_COOKIE_NAME)?.value;
  const cartItems = parseCartCookie(rawCart);

  if (cartItems.length === 0) {
    redirect("/cart");
  }

  const variantIds = cartItems.map((i) => i.variantId);
  const variants = await db.productVariant.findMany({
    where: { id: { in: variantIds } },
  });

  const subtotal = cartItems.reduce((acc, item) => {
    const v = variants.find((variant) => variant.id === item.variantId);
    return acc + (v ? v.price * item.qty : 0);
  }, 0);

  const user = await getCurrentUser();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Thanh Toán Đơn Hàng</h1>
          <p className="text-xs text-slate-400">Giao dịch an toàn qua mã QR Ngân hàng tự động</p>
        </div>
      </div>

      <CheckoutForm
        initialSubtotal={subtotal}
        initialCartItems={cartItems}
        userEmail={user?.email || ""}
        userName={user?.name || ""}
      />
    </div>
  );
}
