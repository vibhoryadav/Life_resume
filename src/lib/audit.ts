import prisma from "./db";

export async function logAuditEvent(params: {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  try {
    if (process.env.AUDIT_LOG_ENABLED === "false") return;

    await prisma.auditLog.create({
      data: {
        actor_id: params.actorId || null,
        action: params.action,
        entity_type: params.entityType,
        entity_id: params.entityId || null,
        metadata: (params.metadata as any) || undefined,
      },
    });
  } catch (error) {
    // Non-blocking for primary transaction flow, but logged to stderr
    console.error("[AuditLog Error]", error);
  }
}
