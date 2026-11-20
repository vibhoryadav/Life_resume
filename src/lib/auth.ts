import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import prisma from "./db";

const JWT_SECRET = process.env.AUTH_SECRET || process.env.JWT_SECRET || "fallback-secret-for-life-resume-minimum-32-chars-long";
const SESSION_COOKIE_NAME = "lr_session_token";
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days

export interface SessionPayload {
  userId: string;
  email: string;
  role: Role;
  fullName: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export function generateSecureToken(byteLength = 32): { rawToken: string; tokenHash: string } {
  const rawToken = crypto.randomBytes(byteLength).toString("hex");
  const tokenHash = hashToken(rawToken);
  return { rawToken, tokenHash };
}

export function signSessionToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    }) as SessionPayload;
    return decoded;
  } catch {
    return null;
  }
}

export async function getSessionUser(req?: NextRequest | Request): Promise<SessionPayload | null> {
  let token: string | undefined;

  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const matches = cookieHeader.match(new RegExp(`(?:^|; )${SESSION_COOKIE_NAME}=([^;]*)`));
        if (matches && matches[1]) {
          token = decodeURIComponent(matches[1]);
        }
      }
    }
  }

  if (!token) {
    try {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
      token = sessionCookie?.value;
    } catch {
      // In non-Server-Action / Edge contexts
    }
  }

  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAuth(req?: NextRequest | Request): Promise<SessionPayload> {
  const session = await getSessionUser(req);
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  // Ensure user is still active in database
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, account_status: true, role: true },
  });

  if (!user || user.account_status !== "ACTIVE") {
    throw new Error("FORBIDDEN");
  }

  return session;
}

export async function requireRole(allowedRoles: Role[], req?: NextRequest | Request): Promise<SessionPayload> {
  const session = await requireAuth(req);
  if (!allowedRoles.includes(session.role)) {
    throw new Error("FORBIDDEN_INSUFFICIENT_ROLE");
  }
  return session;
}

export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
