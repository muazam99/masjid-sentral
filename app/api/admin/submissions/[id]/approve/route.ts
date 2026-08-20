import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getApiBaseUrl()}/submissions/${id}/approve`, {
    method: "POST",
    headers: { Cookie: request.headers.get("cookie") ?? "" },
  });

  const responseBody = await res.json().catch(() => ({ error: "Invalid response from API" }));
  return NextResponse.json(responseBody, { status: res.status });
}
