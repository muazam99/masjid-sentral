import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api";

export async function GET(request: NextRequest) {
  const res = await fetch(`${getApiBaseUrl()}/submissions${request.nextUrl.search}`, {
    headers: { Cookie: request.headers.get("cookie") ?? "" },
  });

  const responseBody = await res.json().catch(() => ({ error: "Invalid response from API" }));
  return NextResponse.json(responseBody, { status: res.status });
}
