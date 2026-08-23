import crypto from "crypto";
import { env } from "./env";

/**
 * Hashes an IP address with a secret salt to preserve privacy (GDPR compliant)
 */
export function hashIp(ip: string, customSalt?: string): string {
  const salt = customSalt || env.IP_SALT || "secret-ip-salt";
  return crypto.createHash("sha256").update(`${ip}:${salt}`).digest("hex");
}
