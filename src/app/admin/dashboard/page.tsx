import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/format";
import Link from "next/link";
import { DollarSign, ShoppingBag, Users, Clock, ArrowRight } from "lucide-react";

export default async function AdminDashboardPage() {
  const [paidOrders, pendingOrders, totalUsers, products] = await Promise.all([
    db.order.findMany({
      where: { status: "paid" },
    }),
    db.order.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.user.count(),
    db.product.findMany({
      where: { status: "published" },
      orderBy: { salesCount: "desc" },
      take: 5,
    }),
  ]);

  const totalRevenue = paidOrders.reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Quản Trị Hệ Thống (Admin CMS)</h1>
        <p className="text-xs text-slate-400 mt-1">
          Thống kê doanh thu, duyệt đơn hàng và quản lý sản phẩm số.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Tổng Doanh Thu</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            {formatCurrency(totalRevenue)}
          </div>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Đơn Chờ Xác Nhận</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">
            {pendingOrders.length}
          </div>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Đơn Đã Thanh Toán</span>
            <ShoppingBag className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{paidOrders.length}</div>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Người Dùng Đăng Ký</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{totalUsers}</div>
        </div>
      </div>

      {/* Pending Orders & Top Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Orders */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Đơn Hàng Chờ Duyệt Gần Đây
            </h2>
            <Link href="/admin/orders" className="text-xs text-cyan-400 hover:underline">
              Xem tất cả &rarr;
            </Link>
          </div>

          {pendingOrders.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">Không có đơn hàng nào đang chờ duyệt.</p>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {pendingOrders.map((order) => (
                <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-mono font-bold text-cyan-400">{order.publicCode}</div>
                    <div className="text-slate-400">{order.buyerEmail}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-emerald-400">
                      {formatCurrency(order.total)}
                    </div>
                    <div className="text-[11px] text-slate-500">{formatDate(order.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h2 className="text-sm font-bold text-white">Top Sản Phẩm Bán Chạy</h2>
            <Link href="/admin/products" className="text-xs text-cyan-400 hover:underline">
              Quản lý &rarr;
            </Link>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {products.map((product) => (
              <div key={product.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{product.title}</div>
                  <div className="text-slate-400 font-mono">{formatCurrency(product.basePrice)}</div>
                </div>
                <div className="font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full">
                  {product.salesCount} đã bán
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
