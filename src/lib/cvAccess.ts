// Signed, expiring CV access token (HMAC-SHA256 via Web Crypto, so it works in
// both the Edge middleware and Node route handlers). Replaces the old static
// "granted" cookie, which anyone could forge by hand.

export const CV_COOKIE = "cv_access";
export const CV_TTL_SECONDS = 60 * 60 * 4;

function secret(): string {
  const s = process.env.CV_COOKIE_SECRET || process.env.JWT_SECRET;
  if (!s || s.length < 16) {
    throw new Error("CV_COOKIE_SECRET (or JWT_SECRET) must be set, 16+ chars");
  }
  return s;
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createCvToken(): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + CV_TTL_SECONDS;
  return `${exp}.${await hmac(`cv:${exp}`)}`;
}

export async function verifyCvToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [expStr, sig] = token.split(".");
  const exp = Number(expStr);
  if (!sig || !Number.isInteger(exp) || exp < Date.now() / 1000) return false;
  try {
    return safeEqual(sig, await hmac(`cv:${exp}`));
  } catch {
    return false;
  }
}
