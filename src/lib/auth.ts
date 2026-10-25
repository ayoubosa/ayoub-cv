import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./db";

const ACCESS_EXPIRY = 900;
const REFRESH_EXPIRY = 604800;

function requireSecret(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required environment variable: ${name}`);
  return val;
}

export interface TokenPayload {
  id: string;
  email: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, requireSecret("JWT_SECRET"), {
    expiresIn: ACCESS_EXPIRY,
  } as jwt.SignOptions);
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, requireSecret("JWT_REFRESH_SECRET"), {
    expiresIn: REFRESH_EXPIRY,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, requireSecret("JWT_SECRET")) as TokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, requireSecret("JWT_REFRESH_SECRET")) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getAuthUser(): Promise<TokenPayload | null> {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) return null;
  return verifyAccessToken(accessToken);
}

export async function requireAdmin(): Promise<TokenPayload> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function findAdminByEmail(email: string) {
  return prisma.adminUser.findUnique({ where: { email } });
}
