import { requireUser } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { ReferralPanel } from "@/components/dashboard/ReferralPanel";
import { env } from "@/lib/env";
import { formatCurrency } from "@/lib/format";
import { ShoppingBag, DollarSign, Package } from "lucide-react";

export default async function DashboardOverviewPage() {
  const user = await requireUser();

  const [orders, referrals] = await Promise.all([
    db.order.findMany({
      where: { userId: user.id, status: "paid" },
      include: { items: true },
    }),
    db.referral.findMany({
      where: { referrerId: user.id },
    }),
  ]);

  const totalSpent = orders.reduce((acc, o) => acc + o.total, 0);
  const confirmedEarnings = referrals
    .filter((r) => r.status === "confirmed")
    .reduce((acc, r) => acc + r.commission, 0);

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="glass-card p-6 md:p-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">
            Xin chào, <span className="gradient-text">{user.name || "Khách hàng"}</span> 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Chào mừng bạn quay lại hệ thống quản lý tài nguyên số và tiếp thị liên kết.
          </p>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Đơn hàng đã thanh toán</span>
            <ShoppingBag className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{orders.length}</div>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Tổng chi tiêu</span>
            <Package className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {formatCurrency(totalSpent)}
          </div>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Hoa hồng Referral (10%)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            {formatCurrency(confirmedEarnings)}
          </div>
        </div>
      </div>

      {/* Referral Panel */}
      <ReferralPanel
        referralCode={user.referralCode || "FORGE88"}
        confirmedEarnings={confirmedEarnings}
        totalReferrals={referrals.length}
        siteUrl={env.NEXT_PUBLIC_SITE_URL}
      />
    </div>
  );
}
