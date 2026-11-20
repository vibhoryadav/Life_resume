import { describe, it, expect } from "vitest";
import {
  hashPassword,
  comparePassword,
  generateSecureToken,
  hashToken,
  signSessionToken,
  verifySessionToken,
} from "../lib/auth";

describe("Authentication & Cryptographic Utilities", () => {
  it("should securely hash passwords and verify matching passwords", async () => {
    const raw = "SuperSecretPassword123!";
    const hashed = await hashPassword(raw);

    expect(hashed).not.toBe(raw);
    expect(hashed.startsWith("$2")).toBe(true);

    const matches = await comparePassword(raw, hashed);
    expect(matches).toBe(true);

    const wrong = await comparePassword("WrongPassword!", hashed);
    expect(wrong).toBe(false);
  });

  it("should generate cryptographically random tokens and consistent SHA-256 hashes", () => {
    const { rawToken, tokenHash } = generateSecureToken();

    expect(rawToken).toHaveLength(64); // 32 bytes hex
    expect(tokenHash).toHaveLength(64);

    // Re-hashing the raw token must match
    const computedHash = hashToken(rawToken);
    expect(computedHash).toBe(tokenHash);

    // Different raw tokens must produce distinct hashes
    const second = generateSecureToken();
    expect(second.tokenHash).not.toBe(tokenHash);
  });

  it("should sign and verify valid JWT sessions", () => {
    const payload = {
      userId: "user-123",
      email: "test@liferesume.com",
      role: "USER" as const,
      fullName: "Test User",
    };

    const token = signSessionToken(payload);
    expect(typeof token).toBe("string");

    const decoded = verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(payload.userId);
    expect(decoded?.email).toBe(payload.email);
    expect(decoded?.role).toBe(payload.role);
  });

  it("should reject tampered or invalid JWT tokens", () => {
    const invalid = verifySessionToken("tampered.token.here");
    expect(invalid).toBeNull();
  });
});
