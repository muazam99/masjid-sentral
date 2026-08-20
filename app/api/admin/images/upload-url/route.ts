import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/admin-auth";
import { getApiBaseUrl } from "@/lib/api";

export async function POST() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!(await isValidAdminSession(session))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.MASJID_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "MASJID_API_KEY is not configured" }, { status: 503 });
  }

  const res = await fetch(`${getApiBaseUrl()}/images/upload-url`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  const body = await res.json().catch(() => ({ error: "Invalid response from API" }));
  return NextResponse.json(body, { status: res.status });
}
