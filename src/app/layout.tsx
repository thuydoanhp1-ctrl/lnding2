import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ReferralCapture } from "@/components/store/ReferralCapture";
import { env } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${env.NEXT_PUBLIC_SITE_NAME} - Sàn Sản Phẩm Số & AI Tự Động Hóa`,
    template: `%s | ${env.NEXT_PUBLIC_SITE_NAME}`,
  },
  description:
    "Kho tài nguyên số cao cấp: Ebook, Notion templates, AI prompt packs, LUTs và Source code chất lượng cao cho nhà sáng tạo và doanh nghiệp.",
  keywords: ["Sản phẩm số", "Notion Template", "AI Prompts", "Presets Lightroom", "Digital Marketplace"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#07090e] text-white antialiased min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white">
        <Suspense fallback={null}>
          <ReferralCapture />
        </Suspense>

        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
