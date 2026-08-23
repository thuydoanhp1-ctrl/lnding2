"use client";

import { useState } from "react";
import { confirmOrderPaymentAction } from "@/app/admin/orders/actions";
import { Check, Loader2 } from "lucide-react";

export function OrderActionButtons({ orderId, status }: { orderId: string; status: string }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!confirm("Bạn có chắc chắn muốn xác nhận đã nhận tiền cho đơn hàng này?")) return;
    setLoading(true);
    try {
      await confirmOrderPaymentAction(orderId);
    } catch (err) {
      alert("Lỗi khi duyệt đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  if (status === "paid") {
    return (
      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-xs">
        Đã thanh toán
      </span>
    );
  }

  return (
    <button
      onClick={handleConfirm}
      disabled={loading}
      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
      <span>Duyệt Thanh Toán</span>
    </button>
  );
}
