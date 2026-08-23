import crypto from "crypto";
import { env } from "./env";

const REFERRAL_CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * Generates an 8-character unique referral code (avoids ambiguous chars like 0, O, 1, I)
 */
export function generateReferralCode(): string {
  let code = "";
  const bytes = crypto.randomBytes(8);
  for (let i = 0; i < 8; i++) {
    code += REFERRAL_CHARSET[bytes[i] % REFERRAL_CHARSET.length];
  }
  return code;
}

/**
 * Computes referral commission from order total
 */
export function computeReferralCommission(amount: number): number {
  const rate = parseFloat(env.REFERRAL_RATE || "0.1");
  return Math.floor(amount * rate);
}
