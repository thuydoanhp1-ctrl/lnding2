import { cookies } from "next/headers";
import Link from "next/link";
import { db } from "@/lib/db";
import { parseCartCookie, CART_COOKIE_NAME } from "@/lib/cart";
import { formatCurrency } from "@/lib/format";
import { ShoppingBag, ArrowRight, Trash2 } from "lucide-react";

export default async function CartPage() {
  const cookieStore = await cookies();
  const rawCart = cookieStore.get(CART_COOKIE_NAME)?.value;
  const cartItems = parseCartCookie(rawCart);

  const variantIds = cartItems.map((i) => i.variantId);
  const variants = await db.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: true },
  });

  const hydratedItems = cartItems
    .map((item) => {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) return null;
      return {
        ...item,
        variant,
        product: variant.product,
      };
    })
    .filter(Boolean);

  const subtotal = hydratedItems.reduce((acc, item) => acc + (item?.variant.price || 0) * (item?.qty || 1), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex items-center gap-3 pb-6 border-b border-white/[0.08]">
        <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Giỏ Hàng Của Bạn</h1>
          <p className="text-xs text-slate-400">Kiểm tra các sản phẩm số và bản quyền đã chọn</p>
        </div>
      </div>

      {hydratedItems.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-4">
          <p className="text-slate-400 text-base">Giỏ hàng của bạn đang trống.</p>
          <Link href="/products" className="btn-primary py-2.5 px-6 text-sm inline-flex">
            Khám Phá Sản Phẩm Ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="glass-card divide-y divide-white/[0.06] overflow-hidden">
            {hydratedItems.map((item: any) => (
              <div key={item.variantId} className="p-5 flex items-center justify-between gap-4">
                <div>
                  <Link href={`/products/${item.product.slug}`} className="font-bold text-white text-sm hover:text-cyan-400 transition-colors">
                    {item.product.title}
                  </Link>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Gói: <strong className="text-slate-300">{item.variant.name}</strong> • SL: {item.qty}
                  </div>
                </div>

                <div className="text-right font-mono font-bold text-emerald-400 text-base">
                  {formatCurrency(item.variant.price * item.qty)}
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal & Action */}
          <div className="glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block">Tổng Tạm Tính:</span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <Link href="/checkout" className="btn-primary py-3 px-8 text-base w-full sm:w-auto">
              <span>Tiến Hành Thanh Toán</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
