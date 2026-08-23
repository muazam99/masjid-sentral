import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api";

// Gates /admin/* on the real Better Auth session + role — this is a UX
// convenience for fast redirects, not the security boundary (see the same
// caveat in lib/server-session.ts: the real enforcement is the API worker's
// requireAdmin middleware on the actual write/admin routes).
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return redirectToLogin(request, pathname);
  }

  const res = await fetch(`${getApiBaseUrl()}/auth/get-session`, {
    headers: { Cookie: cookieHeader },
  });

  if (!res.ok) {
    return redirectToLogin(request, pathname);
  }

  const body = (await res.json().catch(() => null)) as { user?: { role?: string } } | null;
  if (body?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest, pathname: string) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
