import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/format";
import { OrderActionButtons } from "@/components/admin/OrderActionButtons";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Quản Lý Đơn Hàng</h1>
        <p className="text-xs text-slate-400 mt-1">Danh sách toàn bộ đơn hàng và đối soát thanh toán VietQR</p>
      </div>

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/[0.04] text-slate-300 font-bold border-b border-white/[0.06]">
            <tr>
              <th className="p-4">Mã Đơn</th>
              <th className="p-4">Khách Hàng</th>
              <th className="p-4">Tổng Tiền</th>
              <th className="p-4">Nội Dung Memo</th>
              <th className="p-4">Ngày Tạo</th>
              <th className="p-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-slate-300">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-white/[0.02]">
                <td className="p-4 font-mono font-bold text-cyan-400">{order.publicCode}</td>
                <td className="p-4">
                  <div className="font-semibold text-white">{order.buyerName}</div>
                  <div className="text-slate-400 text-[11px]">{order.buyerEmail}</div>
                </td>
                <td className="p-4 font-mono font-bold text-emerald-400">{formatCurrency(order.total)}</td>
                <td className="p-4 font-mono text-amber-400 bg-black/20">{order.paymentMemo}</td>
                <td className="p-4 text-slate-400">{formatDate(order.createdAt)}</td>
                <td className="p-4 text-right">
                  <OrderActionButtons orderId={order.id} status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
