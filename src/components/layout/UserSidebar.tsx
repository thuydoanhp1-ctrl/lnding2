"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, DownloadCloud, ShoppingBag, Star, Settings } from "lucide-react";

export function UserSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Tổng quan & Referral", icon: LayoutDashboard },
    { href: "/dashboard/library", label: "Thư viện file đã mua", icon: DownloadCloud },
    { href: "/dashboard/orders", label: "Lịch sử đơn hàng", icon: ShoppingBag },
    { href: "/dashboard/reviews", label: "Đánh giá của tôi", icon: Star },
    { href: "/dashboard/settings", label: "Cài đặt & Bảo mật", icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 space-y-1.5">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/40"
                : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}
