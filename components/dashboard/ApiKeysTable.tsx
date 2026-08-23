"use client";

import { useState } from "react";
import { KeyRound, Shield, Trash2, Edit2, Check, X, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ApiKey } from "@/types/ApiKey";
import { updateApiKey, revokeApiKey } from "@/lib/api";

interface ApiKeysTableProps {
  apiKeys: ApiKey[];
  onKeysUpdated: () => void;
  onOpenCreate: () => void;
}

export function ApiKeysTable({ apiKeys, onKeysUpdated, onOpenCreate }: ApiKeysTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [revokingKey, setRevokingKey] = useState<ApiKey | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startRename = (key: ApiKey) => {
    setEditingId(key.id);
    setEditName(key.name);
    setError(null);
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleSaveRename = async (id: number) => {
    if (!editName.trim()) return;
    setActionLoading(id);
    setError(null);
    try {
      await updateApiKey(id, { name: editName.trim() });
      setEditingId(null);
      onKeysUpdated();
    } catch (err: any) {
      setError(err.message || "Failed to update key name");
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmRevoke = async () => {
    if (!revokingKey) return;
    setActionLoading(revokingKey.id);
    setError(null);
    try {
      await revokeApiKey(revokingKey.id);
      setRevokingKey(null);
      onKeysUpdated();
    } catch (err: any) {
      setError(err.message || "Failed to revoke API key");
    } finally {
      setActionLoading(null);
    }
  };

  if (apiKeys.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <KeyRound className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h4 className="text-base font-semibold text-foreground">No API Keys Yet</h4>
          <p className="text-sm text-muted-foreground">
            Generate an API key to start querying masjid data and submitting programs from your applications.
          </p>
        </div>
        <Button onClick={onOpenCreate} className="gap-2">
          <KeyRound className="w-4 h-4" />
          Generate Your First Key
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Key Name</th>
                <th className="px-6 py-4">Tier</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {apiKeys.map((key) => {
                const isActive = key.is_active === 1;
                const isEditing = editingId === key.id;
                const isLoading = actionLoading === key.id;

                return (
                  <tr key={key.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {isEditing ? (
                        <div className="flex items-center gap-2 max-w-xs">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            disabled={isLoading}
                            className="h-8 text-sm"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSaveRename(key.id)}
                            disabled={isLoading || !editName.trim()}
                            className="h-8 w-8 p-0 text-emerald-600"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={cancelRename}
                            disabled={isLoading}
                            className="h-8 w-8 p-0 text-muted-foreground"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>{key.name}</span>
                          {isActive && (
                            <button
                              onClick={() => startRename(key)}
                              className="text-muted-foreground hover:text-foreground opacity-60 hover:opacity-100 transition-opacity"
                              title="Rename key"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {key.tier === "admin" ? (
                        <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 font-medium">
                          Admin Tier
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground font-medium">
                          Public Tier
                        </Badge>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                          <span className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                          Revoked
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(key.created_at).toLocaleDateString("en-MY", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {isActive && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setRevokingKey(key)}
                          disabled={isLoading}
                          className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Revoke
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revocation Confirmation Dialog */}
      {revokingKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-destructive/10 text-destructive">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Revoke API Key</h3>
            </div>

            <p className="text-sm text-muted-foreground">
              Are you sure you want to revoke <strong className="text-foreground">{revokingKey.name}</strong>? Any application or script using this key will immediately lose access to protected API operations.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRevokingKey(null)}
                disabled={actionLoading !== null}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmRevoke}
                disabled={actionLoading !== null}
                className="gap-2"
              >
                {actionLoading === revokingKey.id && <Loader2 className="w-4 h-4 animate-spin" />}
                Revoke Key
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
