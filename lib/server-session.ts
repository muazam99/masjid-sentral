// Server-side session lookup for Server Components / Route Handlers — forwards
// the incoming request's cookies to the API worker's Better Auth session
// endpoint. This is a UX convenience for fast redirects (e.g. bounce an
// anonymous visitor to /login) — it is NOT the security boundary. The real
// enforcement lives in the API worker's requireUser/requireAdmin middleware,
// since a Next.js-side-only check could be bypassed by calling the Route
// Handlers directly.

import { cookies } from "next/headers";
import { getApiBaseUrl } from "@/lib/api";

export type ServerSessionUser = {
  id: string;
  email: string;
  name: string | null;
  role: "user" | "admin";
};

export async function getServerSession(): Promise<ServerSessionUser | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  if (!cookieHeader) return null;

  const res = await fetch(`${getApiBaseUrl()}/auth/get-session`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  if (!res.ok) return null;
  const body = (await res.json().catch(() => null)) as { user?: ServerSessionUser } | null;
  return body?.user ?? null;
}
