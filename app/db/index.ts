import { getCloudflareContext } from "@opennextjs/cloudflare";

type CloudflareEnv = {
  DB: D1Database;
};

export function getDb() {
  const { env } = getCloudflareContext();
  const db = (env as CloudflareEnv).DB;

  if (!db) {
    throw new Error("Missing Cloudflare D1 binding: DB");
  }

  return db;
}
