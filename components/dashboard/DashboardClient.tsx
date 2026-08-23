"use client";

import { useEffect, useState } from "react";
import { KeyRound, Plus, BookOpen, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ApiKeysTable } from "@/components/dashboard/ApiKeysTable";
import { CreateApiKeyModal } from "@/components/dashboard/CreateApiKeyModal";
import { ApiKeyCreatedModal } from "@/components/dashboard/ApiKeyCreatedModal";
import { fetchMyApiKeys } from "@/lib/api";
import { ApiKey } from "@/types/ApiKey";

export function DashboardClient() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createdKeyData, setCreatedKeyData] = useState<ApiKey | null>(null);

  const loadKeys = async () => {
    setLoading(true);
    try {
      const data = await fetchMyApiKeys();
      setApiKeys(data);
    } catch (err) {
      console.error("Failed to load API keys:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKeys();
  }, []);

  const handleKeyCreated = (newKey: ApiKey) => {
    setIsCreateOpen(false);
    setCreatedKeyData(newKey);
    loadKeys();
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">API Keys</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage personal API tokens to integrate Masjid Sentral data into your mobile apps and services.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/docs" target="_blank">
            <Button variant="outline" className="gap-2">
              <BookOpen className="w-4 h-4" />
              API Docs
            </Button>
          </Link>
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            Create API Key
          </Button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your API keys...</p>
        </div>
      ) : (
        <ApiKeysTable
          apiKeys={apiKeys}
          onKeysUpdated={loadKeys}
          onOpenCreate={() => setIsCreateOpen(true)}
        />
      )}

      {/* Modals */}
      <CreateApiKeyModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleKeyCreated}
      />

      {createdKeyData && createdKeyData.key && (
        <ApiKeyCreatedModal
          apiKey={createdKeyData.key}
          name={createdKeyData.name}
          onClose={() => setCreatedKeyData(null)}
        />
      )}
    </div>
  );
}
