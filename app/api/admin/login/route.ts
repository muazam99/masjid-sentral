import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, hashPasscode } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const passcode = process.env.ADMIN_PASSCODE;
  if (!passcode) {
    return NextResponse.json(
      { error: "Admin access is not configured (ADMIN_PASSCODE is unset)" },
      { status: 503 }
    );
  }

  let body: { passcode?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.passcode !== passcode) {
    return NextResponse.json({ error: "Incorrect passcode" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, await hashPasscode(passcode), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return response;
}
