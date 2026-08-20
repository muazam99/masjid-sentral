// Cookie-relay proxy for Better Auth, which actually lives on the API worker.
// The app and API worker are on different domains today, so a cookie set
// directly by the API worker would be third-party (unreliable in Safari etc).
// This route forwards every /api/auth/* request to the API worker server-side
// and relays the response — including every Set-Cookie header — back to the
// browser, so the session cookie lands as first-party on the app's own domain.

import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api";

async function relay(request: NextRequest): Promise<NextResponse> {
  const upstreamUrl = new URL(request.nextUrl.pathname.replace(/^\/api\/auth/, "/auth") + request.nextUrl.search, getApiBaseUrl());

  const upstreamResponse = await fetch(upstreamUrl, {
    method: request.method,
    headers: {
      "Content-Type": request.headers.get("content-type") ?? "application/json",
      Cookie: request.headers.get("cookie") ?? "",
    },
    body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.text(),
    redirect: "manual",
  });

  const response = new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: upstreamResponse.headers,
  });

  // fetch() transparently decompresses the body when we read/forward it as a
  // stream, but leaves the original Content-Encoding/Content-Length headers in
  // place — passing those through verbatim makes the browser try to re-decode
  // already-decoded bytes (ERR_CONTENT_DECODING_FAILED).
  response.headers.delete("content-encoding");
  response.headers.delete("content-length");

  // Headers.get('set-cookie') collapses multiple cookies into one string —
  // must iterate getSetCookie() and append each individually.
  response.headers.delete("set-cookie");
  for (const cookie of upstreamResponse.headers.getSetCookie()) {
    response.headers.append("set-cookie", cookie);
  }

  return response;
}

export async function GET(request: NextRequest) {
  return relay(request);
}

export async function POST(request: NextRequest) {
  return relay(request);
}
