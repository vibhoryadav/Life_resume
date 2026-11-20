import { vi } from "vitest";

// Mock environment variables for testing
process.env.AUTH_SECRET = "test-secret-at-least-32-characters-long-key";
process.env.JWT_SECRET = "test-secret-at-least-32-characters-long-key";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
