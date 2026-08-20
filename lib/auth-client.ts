// Client-side Better Auth instance — talks only to this app's own /api/auth/*
// proxy (same-origin), never directly to the API worker, so the session cookie
// stays first-party.

import { createAuthClient } from "better-auth/react";

// Better Auth's client constructs a URL from baseURL eagerly at module-init time,
// which throws on a bare relative path during Next.js's server-side prerender pass
// (no window.location to resolve against). Real requests only ever happen in the
// browser, so the server-side value here is just a placeholder to satisfy `new URL()`.
const baseURL =
  typeof window !== "undefined"
    ? `${window.location.origin}/api/auth`
    : `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/auth`;

export const authClient = createAuthClient({
  baseURL,
});

export const { useSession, signIn, signUp, signOut } = authClient;
