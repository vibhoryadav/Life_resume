import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const ALLOWED_EXTENSIONS = new Set([".pdf", ".jpg", ".jpeg", ".png", ".webp"]);
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export interface StorageUploadResult {
  fileName: string;
  fileType: string;
  storagePath: string;
  fileSize: number;
}

export function validateFileMetadata(name: string, type: string, size: number) {
  if (size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File size exceeds 10MB limit.");
  }

  const ext = path.extname(name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error(`File extension '${ext}' is not permitted.`);
  }

  if (!ALLOWED_MIME_TYPES.has(type)) {
    throw new Error(`MIME type '${type}' is not supported.`);
  }
}

export async function storeEvidenceFile(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  userId: string
): Promise<StorageUploadResult> {
  validateFileMetadata(originalName, mimeType, buffer.length);

  // Generate a cryptographically randomized storage key
  const ext = path.extname(originalName).toLowerCase();
  const fileHash = crypto.randomBytes(16).toString("hex");
  const sanitizedSafeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storedFileName = `${Date.now()}-${fileHash}${ext}`;
  const relativePath = path.join("vault", userId, storedFileName);

  // Save to private local vault directory (isolated outside public folder)
  const localVaultDir = path.join(process.cwd(), "storage", "vault", userId);
  await fs.mkdir(localVaultDir, { recursive: true });
  const fullPath = path.join(localVaultDir, storedFileName);
  await fs.writeFile(fullPath, buffer);

  return {
    fileName: sanitizedSafeName,
    fileType: mimeType,
    storagePath: relativePath,
    fileSize: buffer.length,
  };
}

export function generateSignedDownloadToken(evidenceId: string, userId: string, expiresInSeconds = 300): string {
  const expiresAt = Date.now() + expiresInSeconds * 1000;
  const payload = `${evidenceId}:${userId}:${expiresAt}`;
  const signature = crypto
    .createHmac("sha256", process.env.AUTH_SECRET || "fallback-secret-for-signing")
    .update(payload)
    .digest("hex");

  return Buffer.from(JSON.stringify({ evidenceId, userId, expiresAt, signature })).toString("base64url");
}

export function verifySignedDownloadToken(tokenString: string): { evidenceId: string; userId: string } | null {
  try {
    const raw = Buffer.from(tokenString, "base64url").toString("utf-8");
    const { evidenceId, userId, expiresAt, signature } = JSON.parse(raw);

    if (Date.now() > expiresAt) return null;

    const payload = `${evidenceId}:${userId}:${expiresAt}`;
    const expectedSig = crypto
      .createHmac("sha256", process.env.AUTH_SECRET || "fallback-secret-for-signing")
      .update(payload)
      .digest("hex");

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return { evidenceId, userId };
    }
    return null;
  } catch {
    return null;
  }
}
