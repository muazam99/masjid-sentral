import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getApiBaseUrl()}/submissions/${id}`, {
    headers: { Cookie: request.headers.get("cookie") ?? "" },
  });

  const responseBody = await res.json().catch(() => ({ error: "Invalid response from API" }));
  return NextResponse.json(responseBody, { status: res.status });
}
