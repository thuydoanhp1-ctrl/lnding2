import { PrismaClient, LicenseType, ProductStatus, CouponType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu nạp dữ liệu mẫu (Seeding data)...");

  // 1. Tạo Categories
  const catAI = await prisma.category.upsert({
    where: { slug: "ai-prompts-agents" },
    update: {},
    create: {
      name: "AI Prompts & Agents",
      slug: "ai-prompts-agents",
      description: "Bộ kịch bản prompt thực chiến, AI skills và workflow tự động hóa n8n / Claude / Gemini",
      icon: "Bot",
      order: 1,
    },
  });

  const catNotion = await prisma.category.upsert({
    where: { slug: "notion-templates" },
    update: {},
    create: {
      name: "Notion Templates",
      slug: "notion-templates",
      description: "Hệ thống quản lý doanh nghiệp, CRM, Second Brain và quản lý dự án trên Notion",
      icon: "LayoutGrid",
      order: 2,
    },
  });

  const catPresets = await prisma.category.upsert({
    where: { slug: "presets-luts" },
    update: {},
    create: {
      name: "Presets & LUTs",
      slug: "presets-luts",
      description: "Màu điện ảnh cho Lightroom, DaVinci Resolve, Premiere Pro & CapCut",
      icon: "Film",
      order: 3,
    },
  });

  const catCode = await prisma.category.upsert({
    where: { slug: "code-ui-kits" },
    update: {},
    create: {
      name: "Code & UI Kits",
      slug: "code-ui-kits",
      description: "Source code Next.js, React templates, Tailwind UI components sẵn sàng deploy",
      icon: "Code2",
      order: 4,
    },
  });

  // 2. Tạo Sample Products
  // Product 1: AI Marketing Automation Flywheel Pack
  const prod1 = await prisma.product.upsert({
    where: { slug: "ai-marketing-flywheel-pack" },
    update: {},
    create: {
      title: "AI Marketing Automation Flywheel (52 AI Skills Pack)",
      slug: "ai-marketing-flywheel-pack",
      shortDescription: "Bộ 52 kịch bản AI Agents khép kín 8 giai đoạn từ nghiên cứu thị trường đến phân phối nội dung tự động",
      longDescription: `
# AI Marketing Automation Flywheel Pack (52 AI Skills)

Biến bất kỳ AI nào (Claude Code, Cursor, Windsurf, Gemini CLI) thành đội ngũ marketing tự động 24/7.

### 🌟 Điểm nổi bật:
- **52 AI Skills chuẩn hóa:** Gồm kịch bản nghiên cứu đối thủ, quét xu hướng, viết bài viral LinkedIn/TikTok, thiết kế Infographic.
- **Workflow n8n kèm theo:** 1-click import vào hệ sinh thái tự động hóa doanh nghiệp.
- **Tài liệu hướng dẫn 4K:** Video chi tiết từng bước thiết lập.

### 📦 Các định dạng kèm theo:
- File mã nguồn System Instructions & SKILL.md
- File n8n workflow .json
- Hướng dẫn cấu hình API
      `,
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&auto=format&fit=crop&q=80",
      ],
      categoryId: catAI.id,
      tags: ["AI", "Automation", "Marketing", "Claude", "n8n"],
      status: ProductStatus.published,
      featured: true,
      basePrice: 490000,
      salesCount: 142,
      ratingAvg: 4.95,
      ratingCount: 28,
    },
  });

  // Variants for Product 1
  await prisma.productVariant.upsert({
    where: { productId_code: { productId: prod1.id, code: "PERSONAL" } },
    update: {},
    create: {
      productId: prod1.id,
      code: "PERSONAL",
      name: "Bản Quyền Cá Nhân",
      description: "Dùng cho 1 người, dự án cá nhân hoặc solopreneur",
      price: 490000,
      comparePrice: 980000,
      licenseType: LicenseType.personal,
      maxDownloads: 5,
      downloadExpiry: 365,
      available: true,
      order: 1,
    },
  });

  await prisma.productVariant.upsert({
    where: { productId_code: { productId: prod1.id, code: "COMMERCIAL" } },
    update: {},
    create: {
      productId: prod1.id,
      code: "COMMERCIAL",
      name: "Bản Quyền Doanh Nghiệp (Team & Commercial)",
      description: "Dùng cho doanh nghiệp, tối đa 10 thành viên, kèm hỗ trợ cài đặt",
      price: 1490000,
      comparePrice: 2980000,
      licenseType: LicenseType.commercial,
      maxDownloads: 20,
      downloadExpiry: 730,
      available: true,
      order: 2,
    },
  });

  // Sample Coupon
  await prisma.coupon.upsert({
    where: { code: "WELCOME20" },
    update: {},
    create: {
      code: "WELCOME20",
      description: "Giảm 20% cho đơn hàng đầu tiên",
      type: CouponType.percent,
      value: 20,
      minOrderAmount: 200000,
      maxDiscount: 200000,
      usageLimit: 100,
      active: true,
    },
  });

  console.log("✅ Seed dữ liệu thành công!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
