"use client";

import { useState } from "react";
import { ProductVariant } from "@prisma/client";
import { LICENSE_LABELS } from "@/lib/licenses";
import { formatCurrency } from "@/lib/format";
import { ShoppingBag, Check, Shield } from "lucide-react";
import { CART_COOKIE_NAME, parseCartCookie, serializeCartCookie } from "@/lib/cart";

interface VariantSelectorProps {
  variants: ProductVariant[];
  productTitle: string;
}

export function VariantSelector({ variants, productTitle }: VariantSelectorProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    variants[0]?.id || ""
  );
  const [added, setAdded] = useState(false);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];
  const licenseInfo = selectedVariant ? LICENSE_LABELS[selectedVariant.licenseType] : null;

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    // Read cookie
    const cookies = document.cookie.split("; ");
    const cartCookie = cookies.find((row) => row.startsWith(`${CART_COOKIE_NAME}=`));
    const rawVal = cartCookie ? decodeURIComponent(cartCookie.split("=")[1]) : "";
    const items = parseCartCookie(rawVal);

    // Upsert variant in cart
    const existingIndex = items.findIndex((i) => i.variantId === selectedVariant.id);
    if (existingIndex > -1) {
      items[existingIndex].qty += 1;
    } else {
      items.push({ variantId: selectedVariant.id, qty: 1 });
    }

    // Save cookie
    document.cookie = `${CART_COOKIE_NAME}=${encodeURIComponent(
      serializeCartCookie(items)
    )}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (!selectedVariant) return null;

  return (
    <div className="glass-card p-6 md:p-8 space-y-6">
      {/* Price Display */}
      <div className="space-y-1">
        {selectedVariant.comparePrice && selectedVariant.comparePrice > selectedVariant.price && (
          <div className="text-sm text-slate-500 line-through">
            {formatCurrency(selectedVariant.comparePrice)}
          </div>
        )}
        <div className="text-3xl font-extrabold text-emerald-400 font-mono">
          {formatCurrency(selectedVariant.price)}
        </div>
      </div>

      {/* License / Variant Options */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Chọn Giấy Phép Sử Dụng:
        </label>
        <div className="space-y-2">
          {variants.map((v) => {
            const isSelected = v.id === selectedVariantId;
            const lInfo = LICENSE_LABELS[v.licenseType];
            return (
              <button
                key={v.id}
                onClick={() => setSelectedVariantId(v.id)}
                className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/10"
                    : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:bg-white/[0.06] hover:text-slate-200"
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <span>{v.name}</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white/10 text-cyan-400 font-mono">
                      {lInfo?.label}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{v.description || lInfo?.description}</div>
                </div>
                <div className="font-mono font-bold text-sm text-emerald-400 ml-4">
                  {formatCurrency(v.price)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* License Perks */}
      {licenseInfo && (
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-2.5 text-xs text-slate-300">
          <Shield className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <span>
            {licenseInfo.description} Giới hạn lượt tải:{" "}
            <strong>{selectedVariant.maxDownloads ? `${selectedVariant.maxDownloads} lần` : "Không giới hạn"}</strong>.
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button onClick={handleAddToCart} className="btn-primary w-full py-3.5 text-base">
          {added ? (
            <>
              <Check className="w-5 h-5 text-white" />
              <span>Đã Thêm Vào Giỏ Hàng!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              <span>Thêm Vào Giỏ Hàng</span>
            </>
          )}
        </button>

        <a
          href="/cart"
          className="btn-secondary w-full py-3 text-sm text-center block text-slate-300"
        >
          Xem Giỏ Hàng & Thanh Toán &rarr;
        </a>
      </div>
    </div>
  );
}
