import { describe, it, expect } from "vitest";
import {
  validateFileMetadata,
  generateSignedDownloadToken,
  verifySignedDownloadToken,
} from "../lib/storage";

describe("Storage Security & Signed Downloads", () => {
  it("should accept valid PDF and image formats under size threshold", () => {
    expect(() => {
      validateFileMetadata("certificate.pdf", "application/pdf", 1024 * 1024);
    }).not.toThrow();

    expect(() => {
      validateFileMetadata("award.png", "image/png", 500 * 1024);
    }).not.toThrow();
  });

  it("should reject disallowed extensions or executable files", () => {
    expect(() => {
      validateFileMetadata("malware.exe", "application/x-msdownload", 1024);
    }).toThrow(/extension/i);

    expect(() => {
      validateFileMetadata("script.js", "application/javascript", 1024);
    }).toThrow(/extension/i);
  });

  it("should reject oversized files (>10MB)", () => {
    expect(() => {
      validateFileMetadata("giant.pdf", "application/pdf", 15 * 1024 * 1024);
    }).toThrow(/size exceeds/i);
  });

  it("should generate and verify valid signed download tokens", () => {
    const token = generateSignedDownloadToken("evidence-999", "user-111", 300);
    expect(typeof token).toBe("string");

    const verified = verifySignedDownloadToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.evidenceId).toBe("evidence-999");
    expect(verified?.userId).toBe("user-111");
  });

  it("should reject expired or forged signed download tokens", () => {
    // Generate expired token
    const expiredToken = generateSignedDownloadToken("evidence-999", "user-111", -10);
    const verified = verifySignedDownloadToken(expiredToken);
    expect(verified).toBeNull();
  });
});
