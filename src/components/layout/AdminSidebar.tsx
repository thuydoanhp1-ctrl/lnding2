"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Star,
  Share2,
  FileText,
  ArrowLeft,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", label: "Tổng quan & Thống kê", icon: LayoutDashboard },
    { href: "/admin/products", label: "Quản lý Sản phẩm", icon: Package },
    { href: "/admin/orders", label: "Quản lý Đơn hàng", icon: ShoppingBag },
    { href: "/admin/users", label: "Quản lý Người dùng", icon: Users },
    { href: "/admin/coupons", label: "Mã giảm giá (Coupons)", icon: Tag },
    { href: "/admin/referrals", label: "Duyệt Referral", icon: Share2 },
    { href: "/admin/reviews", label: "Kiểm duyệt Đánh giá", icon: Star },
    { href: "/admin/audit-log", label: "Lịch sử Audit Log", icon: FileText },
  ];

  return (
    <aside className="w-full md:w-64 space-y-4">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Về trang người dùng</span>
      </Link>

      <div className="space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
