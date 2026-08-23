"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/format";
import { Copy, Check, Users, DollarSign, Share2 } from "lucide-react";

interface ReferralPanelProps {
  referralCode: string;
  confirmedEarnings: number;
  totalReferrals: number;
  siteUrl: string;
}

export function ReferralPanel({
  referralCode,
  confirmedEarnings,
  totalReferrals,
  siteUrl,
}: ReferralPanelProps) {
  const [copied, setCopied] = useState(false);
  const referralLink = `${siteUrl}?ref=${referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Chương Trình Tiếp Thị Liên Kết (Affiliate)</h3>
            <p className="text-xs text-slate-400">Nhận ngay 10% hoa hồng trên mỗi đơn hàng khi chia sẻ link giới thiệu</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Số đơn giới thiệu thành công</div>
            <div className="text-xl font-bold text-white font-mono">{totalReferrals}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Tổng hoa hồng đã xác nhận</div>
            <div className="text-xl font-extrabold text-emerald-400 font-mono">
              {formatCurrency(confirmedEarnings)}
            </div>
          </div>
        </div>
      </div>

      {/* Referral Link Box */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08] space-y-2">
        <span className="text-xs text-slate-400 font-semibold block">Đường dẫn giới thiệu độc quyền của bạn:</span>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none"
          />
          <button
            onClick={copyLink}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap"
          >
            {copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4 text-black" />}
            <span>{copied ? "Đã chép" : "Sao chép"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
