import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/postgres"),
  DIRECT_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().default("https://placeholder.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().default("placeholder-anon-key"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  AUTH_SECRET: z.string().default("default-super-secret-auth-key-32-chars-long"),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  ADMIN_EMAILS: z.string().default("admin@yourdomain.com"),
  SEPAY_BANK: z.string().default("MBBank"),
  SEPAY_ACCOUNT: z.string().default("0123456789"),
  SEPAY_ACCOUNT_NAME: z.string().default("DIGITAL STORE"),
  SEPAY_WEBHOOK_SECRET: z.string().optional(),
  REFERRAL_RATE: z.string().default("0.1"),
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("Digital Store <orders@yourdomain.com>"),
  EMAIL_REPLY_TO: z.string().default("support@yourdomain.com"),
  IP_SALT: z.string().default("default-ip-salt-secret-key-32bytes"),
  DOWNLOAD_IP_SALT: z.string().default("default-download-ip-salt-32bytes"),
  NEXT_PUBLIC_SITE_URL: z.string().default("https://digital-product-store-thuy.vercel.app"),
  NEXT_PUBLIC_SITE_NAME: z.string().default("Digital Forge"),
});

function parseEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    return process.env as unknown as z.infer<typeof envSchema>;
  }
  return result.data;
}

export const env = parseEnv();
