import { Resend } from "resend";
import { env } from "./env";
import { formatCurrency } from "./format";

export async function sendOrderConfirmationEmail(order: any) {
  if (!env.RESEND_API_KEY) {
    console.log("ℹ️ RESEND_API_KEY is not set. Skipping email dispatch.");
    return;
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const siteName = env.NEXT_PUBLIC_SITE_NAME || "Digital Store";
  const siteUrl = env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const orderUrl = `${siteUrl}/order/${order.publicCode}`;
  const libraryUrl = `${siteUrl}/dashboard/library`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
      <div style="background: #0f172a; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${siteName}</h1>
        <p style="color: #94a3b8; margin: 4px 0 0;">Xác nhận đơn hàng thành công</p>
      </div>

      <div style="background: #ffffff; padding: 32px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
        <p>Xin chào <strong>${order.buyerName}</strong>,</p>
        <p>Cảm ơn bạn đã mua sắm tại <strong>${siteName}</strong>! Thanh toán của bạn cho đơn hàng <strong>${order.publicCode}</strong> đã được xác nhận thành công.</p>

        <div style="background: #f8fafc; padding: 18px; border-radius: 6px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <p style="margin: 0 0 8px;"><strong>Mã đơn hàng:</strong> ${order.publicCode}</p>
          <p style="margin: 0 0 8px;"><strong>Tổng thanh toán:</strong> ${formatCurrency(order.total)}</p>
          <p style="margin: 0;"><strong>Trạng thái:</strong> <span style="color: #10b981; font-weight: bold;">Đã thanh toán (Hoàn thành)</span></p>
        </div>

        <p>Các file số của bạn đã sẵn sàng để tải về:</p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${libraryUrl}" style="background: #6366f1; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Truy Cập Thư Viện Tải File Ngay
          </a>
        </div>

        <p style="font-size: 0.9em; color: #64748b;">
          Bạn cũng có thể theo dõi chi tiết đơn hàng tại: <a href="${orderUrl}" style="color: #6366f1;">${orderUrl}</a>
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 0.85em; color: #94a3b8; text-align: center;">
          Nếu bạn cần hỗ trợ, vui lòng gửi email về: ${env.EMAIL_REPLY_TO}
        </p>
      </div>
    </div>
  `;

  return resend.emails.send({
    from: env.EMAIL_FROM,
    to: order.buyerEmail,
    replyTo: env.EMAIL_REPLY_TO,
    subject: `[${siteName}] Xác nhận đơn hàng ${order.publicCode} - File số đã sẵn sàng tải về`,
    html,
  });
}
