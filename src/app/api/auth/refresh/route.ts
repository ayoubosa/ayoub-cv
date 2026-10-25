import { NextResponse } from "next/server";
import { verifyRefreshToken, signAccessToken } from "@/lib/auth";

export async function POST() {
  const { cookies } = await import("next/headers");
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 }
    );
  }

  const accessToken = signAccessToken({
    id: payload.id,
    email: payload.email,
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });

  return response;
}
