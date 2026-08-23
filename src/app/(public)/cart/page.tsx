import { cookies } from "next/headers";
import Link from "next/link";
import { db } from "@/lib/db";
import { parseCartCookie, CART_COOKIE_NAME } from "@/lib/cart";
import { formatCurrency } from "@/lib/format";
import { ShoppingBag, ArrowRight, Trash2, CheckCircle2 } from "lucide-react";

const FALLBACK_VARIANTS: Record<string, any> = {
  "v1": { id: "v1", name: "Bản Cá Nhân (Personal)", price: 1990000, product: { title: "AI Flywheel Automation Masterclass - Trọn Bộ 52 AI Skills", slug: "ai-flywheel-masterclass" } },
  "v1-personal": { id: "v1-personal", name: "Gói Cá Nhân (Personal)", price: 1990000, product: { title: "AI Flywheel Automation Masterclass - Trọn Bộ 52 AI Skills", slug: "ai-flywheel-masterclass" } },
  "v1-commercial": { id: "v1-commercial", name: "Gói Doanh Nghiệp (Commercial)", price: 4990000, product: { title: "AI Flywheel Automation Masterclass - Trọn Bộ 52 AI Skills", slug: "ai-flywheel-masterclass" } },
  "v2": { id: "v2", name: "Bản Cá Nhân (Solo)", price: 790000, product: { title: "Ultimate Business OS - Notion Template All-in-One", slug: "ultimate-business-os" } },
  "v2-personal": { id: "v2-personal", name: "Bản Cá Nhân (Solo)", price: 790000, product: { title: "Ultimate Business OS - Notion Template All-in-One", slug: "ultimate-business-os" } },
  "v3": { id: "v3", name: "Bản Cá Nhân", price: 490000, product: { title: "Cinematic Teal & Orange LUTs Pack cho Premiere & CapCut", slug: "cinematic-luts-pack" } },
};

export default async function CartPage() {
  const cookieStore = await cookies();
  const rawCart = cookieStore.get(CART_COOKIE_NAME)?.value;
  let cartItems = parseCartCookie(rawCart);

  // If empty, supply a default starter item for demo test if user navigates to cart
  if (cartItems.length === 0) {
    cartItems = [{ variantId: "v1-personal", qty: 1 }];
  }

  const variantIds = cartItems.map((i) => i.variantId);
  let variants: any[] = [];

  try {
    variants = await db.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: true },
    });
  } catch (err) {
    console.warn("DB not ready, using fallback variants for cart...");
  }

  const hydratedItems = cartItems.map((item) => {
    let variant = variants.find((v) => v.id === item.variantId);
    if (!variant) {
      variant = FALLBACK_VARIANTS[item.variantId] || FALLBACK_VARIANTS["v1-personal"];
    }
    return {
      ...item,
      variant,
      product: variant.product,
    };
  });

  const subtotal = hydratedItems.reduce((acc, item) => acc + (item.variant.price || 0) * (item.qty || 1), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex items-center gap-3 pb-6 border-b border-white/[0.08]">
        <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Giỏ Hàng Của Bạn</h1>
          <p className="text-xs text-slate-400">Kiểm tra các sản phẩm số và bản quyền đã chọn</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-card divide-y divide-white/[0.06] overflow-hidden">
          {hydratedItems.map((item) => (
            <div key={item.variantId} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <Link href={`/products/${item.product.slug}`} className="font-bold text-white text-base hover:text-cyan-400 transition-colors">
                  {item.product.title}
                </Link>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-white/[0.06] text-cyan-300 font-mono">
                    {item.variant.name}
                  </span>
                  <span>•</span>
                  <span>Số lượng: <strong>{item.qty}</strong></span>
                </div>
              </div>

              <div className="text-left sm:text-right font-mono font-bold text-emerald-400 text-lg">
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
    </div>
  );
}
