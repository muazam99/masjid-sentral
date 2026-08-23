export type ApiKeyTier = "public" | "admin";

export interface ApiKey {
  id: number;
  name: string;
  is_active: number;
  tier: ApiKeyTier;
  created_at: string;
  key?: string; // Only present when key is newly created
}
