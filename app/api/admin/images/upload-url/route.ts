import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApiBaseUrl } from "@/lib/api";

// Any authenticated user (regular contributor or admin) can request an upload URL —
// forwards the session cookie to the API worker's /images/upload-url, which accepts
// either a session or an API key (see apiKeyOrSession middleware).
export async function POST() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  if (!cookieHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(`${getApiBaseUrl()}/images/upload-url`, {
    method: "POST",
    headers: { Cookie: cookieHeader },
  });

  const body = await res.json().catch(() => ({ error: "Invalid response from API" }));
  return NextResponse.json(body, { status: res.status });
}
