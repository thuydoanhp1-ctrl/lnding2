import { z } from "zod";

export const checkoutSchema = z.object({
  buyerName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  buyerEmail: z.string().email("Email không hợp lệ"),
  buyerPhone: z.string().optional(),
  couponCode: z.string().optional(),
  referralCode: z.string().optional(),
  note: z.string().optional(),
  cartItems: z
    .array(
      z.object({
        variantId: z.string(),
        qty: z.number().int().positive(),
      })
    )
    .min(1, "Giỏ hàng không được để trống"),
});

export const couponValidateSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã giảm giá"),
  subtotal: z.number().positive(),
});

export const reviewCreateSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(2, "Tiêu đề đánh giá phải từ 2 ký tự"),
  body: z.string().min(5, "Nội dung đánh giá phải từ 5 ký tự"),
});

export const productCreateSchema = z.object({
  title: z.string().min(3, "Tên sản phẩm phải từ 3 ký tự"),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  categoryId: z.string().optional(),
  coverImage: z.string().optional(),
  gallery: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  basePrice: z.number().int().nonnegative(),
  featured: z.boolean().default(false),
});
