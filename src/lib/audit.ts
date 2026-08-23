import { db } from "./db";
import { AuditAction, Prisma } from "@prisma/client";

interface WriteAuditParams {
  userId?: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  metadata?: Prisma.InputJsonValue;
  ipAddress?: string;
}

export async function writeAuditLog({
  userId,
  action,
  entityType,
  entityId,
  metadata = {},
  ipAddress,
}: WriteAuditParams) {
  try {
    return await db.auditLog.create({
      data: {
        userId: userId || null,
        action,
        entityType,
        entityId,
        metadata,
        ipAddress: ipAddress || null,
      },
    });
  } catch (err) {
    console.error("❌ Failed to write audit log:", err);
  }
}
