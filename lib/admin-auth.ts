// Shared-passcode gate for /admin/* — not a real user/account system, just enough to keep
// the internal Create Masjid tool off the public web until a proper auth system exists.

export const ADMIN_SESSION_COOKIE = "admin_session";

export async function hashPasscode(passcode: string): Promise<string> {
  const data = new TextEncoder().encode(passcode);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hashBuffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function isValidAdminSession(cookieValue: string | undefined): Promise<boolean> {
  const passcode = process.env.ADMIN_PASSCODE;
  if (!passcode || !cookieValue) return false;
  const expected = await hashPasscode(passcode);
  return cookieValue === expected;
}
