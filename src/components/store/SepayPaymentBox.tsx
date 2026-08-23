"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/format";
import { Copy, Check, QrCode, AlertCircle } from "lucide-react";

interface SepayPaymentBoxProps {
  publicCode: string;
  total: number;
  paymentMemo: string;
  bankName: string;
  bankAccount: string;
  accountName: string;
  qrUrl: string;
  onConfirmPending?: () => void;
}

export function SepayPaymentBox({
  publicCode,
  total,
  paymentMemo,
  bankName,
  bankAccount,
  accountName,
  qrUrl,
  onConfirmPending,
}: SepayPaymentBoxProps) {
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const copyToClipboard = (text: string, type: "memo" | "acc") => {
    navigator.clipboard.writeText(text);
    if (type === "memo") {
      setCopiedMemo(true);
      setTimeout(() => setCopiedMemo(false), 2000);
    } else {
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2000);
    }
  };

  const handleConfirm = () => {
    setConfirmed(true);
    if (onConfirmPending) {
      onConfirmPending();
    }
  };

  return (
    <div className="glass-card p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <QrCode className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg">Thanh Toán Chuyển Khoản VietQR</h3>
          <p className="text-xs text-slate-400">Quét mã QR hoặc chuyển khoản chính xác nội dung bên dưới</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* QR Code */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-xl">
          <img src={qrUrl} alt="VietQR Sepay" className="w-56 h-56 object-contain" />
          <span className="text-[11px] font-bold text-slate-700 mt-2">Mở app Ngân hàng để quét QR tự động điền</span>
        </div>

        {/* Transfer details */}
        <div className="space-y-4 text-sm">
          {/* Bank */}
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] flex justify-between items-center">
            <span className="text-slate-400 text-xs">Ngân hàng:</span>
            <span className="font-bold text-white">{bankName}</span>
          </div>

          {/* Account number */}
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] flex justify-between items-center">
            <div>
              <span className="text-slate-400 text-xs block">Số tài khoản:</span>
              <span className="font-mono font-bold text-white text-base">{bankAccount}</span>
            </div>
            <button
              onClick={() => copyToClipboard(bankAccount, "acc")}
              className="p-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-slate-300 transition-colors"
              title="Sao chép số tài khoản"
            >
              {copiedAcc ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Account name */}
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] flex justify-between items-center">
            <span className="text-slate-400 text-xs">Chủ tài khoản:</span>
            <span className="font-bold text-white uppercase">{accountName}</span>
          </div>

          {/* Amount */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex justify-between items-center">
            <span className="text-slate-300 text-xs">Số tiền cần chuyển:</span>
            <span className="font-mono font-extrabold text-emerald-400 text-lg">
              {formatCurrency(total)}
            </span>
          </div>

          {/* Memo - CRITICAL */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/40 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-amber-300 text-xs font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Nội dung chuyển khoản (BẮT BUỘC):
              </span>
              <button
                onClick={() => copyToClipboard(paymentMemo, "memo")}
                className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition-colors flex items-center gap-1"
              >
                {copiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMemo ? "Đã chép" : "Sao chép"}</span>
              </button>
            </div>
            <div className="font-mono font-extrabold text-amber-400 text-base tracking-wider bg-black/40 p-2 rounded-lg text-center">
              {paymentMemo}
            </div>
          </div>
        </div>
      </div>

      {/* Button I have transferred */}
      <div className="pt-4 border-t border-white/[0.08] text-center">
        {confirmed ? (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            Đã ghi nhận thông báo chuyển khoản. Hệ thống sẽ kích hoạt đơn hàng trong giây lát!
          </div>
        ) : (
          <button onClick={handleConfirm} className="btn-primary w-full py-3 text-base">
            Tôi Đã Hoàn Tất Chuyển Khoản
          </button>
        )}
      </div>
    </div>
  );
}
