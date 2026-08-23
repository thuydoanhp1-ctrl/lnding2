import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createPrivateAssetSignedUrl } from "@/lib/storage";
import { hashIp } from "@/lib/ip";
import { env } from "@/lib/env";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Rate limiting per token (10 requests/minute)
    const { success } = await checkRateLimit(`download:${token}`, 10, "1 m");
    if (!success) {
      return NextResponse.json(
        { error: "Bạn đang tải quá nhanh. Vui lòng thử lại sau ít phút." },
        { status: 429 }
      );
    }

    // Lookup token
    const downloadToken = await db.downloadToken.findUnique({
      where: { token },
      include: {
        asset: true,
      },
    });

    if (!downloadToken) {
      return NextResponse.json(
        { error: "Mã tải file không tồn tại hoặc đã bị hủy." },
        { status: 404 }
      );
    }

    if (downloadToken.revoked) {
      return NextResponse.json(
        { error: `Liên kết tải đã bị thu hồi. Lý do: ${downloadToken.revokedReason || "Không xác định"}` },
        { status: 403 }
      );
    }

    const now = new Date();
    if (downloadToken.expiresAt < now) {
      return NextResponse.json(
        { error: "Liên kết tải file đã hết hạn sử dụng." },
        { status: 410 }
      );
    }

    if (downloadToken.maxDownloads !== -1 && downloadToken.downloadCount >= downloadToken.maxDownloads) {
      return NextResponse.json(
        { error: `Bạn đã đạt giới hạn tối đa ${downloadToken.maxDownloads} lượt tải cho file này.` },
        { status: 403 }
      );
    }

    // Generate Signed URL from Supabase Private Bucket (3600s = 1 hour expiry)
    const signedUrl = await createPrivateAssetSignedUrl(downloadToken.asset.storagePath, 3600);
    if (!signedUrl) {
      return NextResponse.json(
        { error: "Không thể tạo liên kết tải an toàn từ máy chủ lưu trữ." },
        { status: 500 }
      );
    }

    // Increment download count and log hashed IP
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const hashedIp = hashIp(ip, env.DOWNLOAD_IP_SALT);

    await db.downloadToken.update({
      where: { id: downloadToken.id },
      data: {
        downloadCount: { increment: 1 },
        lastDownloadAt: now,
        lastIpHash: hashedIp,
      },
    });

    // 302 Redirect directly to Supabase Signed URL
    return NextResponse.redirect(signedUrl, 302);
  } catch (err) {
    console.error("❌ Download Route Error:", err);
    return NextResponse.json({ error: "Lỗi xử lý file tải về" }, { status: 500 });
  }
}
