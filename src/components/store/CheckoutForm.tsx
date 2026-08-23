"use client";

import { useState, useEffect } from "react";
import { SepayPaymentBox } from "./SepayPaymentBox";
import { formatCurrency } from "@/lib/format";
import { CART_COOKIE_NAME, parseCartCookie } from "@/lib/cart";
import { env } from "@/lib/env";
import { ShieldCheck, Tag, Loader2 } from "lucide-react";

interface CheckoutFormProps {
  initialSubtotal: number;
  initialCartItems: any[];
  userEmail?: string;
  userName?: string;
}

export function CheckoutForm({
  initialSubtotal,
  initialCartItems,
  userEmail = "",
  userName = "",
}: CheckoutFormProps) {
  const [buyerName, setBuyerName] = useState(userName);
  const [buyerEmail, setBuyerEmail] = useState(userEmail);
  const [buyerPhone, setBuyerPhone] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [orderResult, setOrderResult] = useState<any>(null);

  useEffect(() => {
    try {
      const savedRef = localStorage.getItem("referralCode");
      if (savedRef) setReferralCode(savedRef);
    } catch {}
  }, []);

  const total = Math.max(0, initialSubtotal - discount);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal: initialSubtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setDiscount(data.discount);
        setCouponMsg(`✓ ${data.message} (-${formatCurrency(data.discount)})`);
      } else {
        setDiscount(0);
        setCouponMsg(`✕ ${data.message || "Mã không hợp lệ"}`);
      }
    } catch {
      setCouponMsg("Lỗi kiểm tra mã giảm giá");
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerName,
          buyerEmail,
          buyerPhone,
          couponCode: discount > 0 ? couponCode : undefined,
          referralCode: referralCode || undefined,
          cartItems: initialCartItems,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể tạo đơn hàng");
      }

      setOrderResult(data);
      // Clear cart cookie
      document.cookie = `${CART_COOKIE_NAME}=; path=/; max-age=0`;
    } catch (err: any) {
      setErrorMsg(err.message || "Đã xảy ra lỗi khi tạo đơn");
    } finally {
      setLoading(false);
    }
  };

  if (orderResult) {
    return (
      <div className="space-y-6">
        <SepayPaymentBox
          publicCode={orderResult.publicCode}
          total={orderResult.total}
          paymentMemo={orderResult.paymentMemo}
          bankName="MBBank"
          bankAccount="0123456789"
          accountName="DIGITAL FORGE"
          qrUrl={orderResult.qrUrl}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleCreateOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Buyer info */}
      <div className="lg:col-span-7 space-y-6">
        <div className="glass-card p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-white/[0.08] pb-3">
            Thông Tin Nhận Sản Phẩm Số
          </h2>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {errorMsg}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Họ và tên của bạn:</label>
            <input
              type="text"
              required
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email nhận file tải về (Bắt buộc):</label>
            <input
              type="email"
              required
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
              placeholder="name@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Số điện thoại / Zalo (Tùy chọn):</label>
            <input
              type="tel"
              value={buyerPhone}
              onChange={(e) => setBuyerPhone(e.target.value)}
              placeholder="0901234567"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Order Summary & Coupon */}
      <div className="lg:col-span-5 space-y-6">
        <div className="glass-card p-6 space-y-5">
          <h2 className="text-base font-bold text-white border-b border-white/[0.08] pb-3">
            Tóm Tắt Thanh Toán
          </h2>

          {/* Coupon Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              Mã giảm giá (Coupon):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="VD: WELCOME20"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-3 py-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-xs font-semibold text-white whitespace-nowrap"
              >
                Áp dụng
              </button>
            </div>
            {couponMsg && <div className="text-xs text-cyan-400">{couponMsg}</div>}
          </div>

          {/* Price rows */}
          <div className="space-y-2 text-xs text-slate-300 border-t border-white/[0.06] pt-4">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span className="font-mono">{formatCurrency(initialSubtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Giảm giá:</span>
                <span className="font-mono">-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/[0.06]">
              <span>Tổng thanh toán:</span>
              <span className="font-mono text-emerald-400 text-base">{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            <span>{loading ? "Đang tạo mã VietQR..." : "Tiến Hành Tạo Mã QR Thanh Toán"}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
