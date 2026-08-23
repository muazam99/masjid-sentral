import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const res = await fetch(`${getApiBaseUrl()}/me/api-keys/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: request.headers.get("cookie") ?? "",
    },
    body: JSON.stringify(body),
  });

  const responseBody = await res.json().catch(() => ({ error: "Invalid response from API" }));
  return NextResponse.json(responseBody, { status: res.status });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await fetch(`${getApiBaseUrl()}/me/api-keys/${id}`, {
    method: "DELETE",
    headers: {
      Cookie: request.headers.get("cookie") ?? "",
    },
  });

  const responseBody = await res.json().catch(() => ({ error: "Invalid response from API" }));
  return NextResponse.json(responseBody, { status: res.status });
}
