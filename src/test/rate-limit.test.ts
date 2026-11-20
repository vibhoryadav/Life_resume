import { describe, it, expect } from "vitest";
import { checkRateLimit } from "../lib/rate-limit";

describe("Rate Limiting Guardrail", () => {
  it("should allow requests under the defined limit and block subsequent attempts", () => {
    const key = `test-user-${Date.now()}`;
    const limit = 3;

    const r1 = checkRateLimit(key, limit, 10000);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = checkRateLimit(key, limit, 10000);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = checkRateLimit(key, limit, 10000);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);

    // 4th request must be rejected
    const r4 = checkRateLimit(key, limit, 10000);
    expect(r4.allowed).toBe(false);
    expect(r4.remaining).toBe(0);
  });
});
