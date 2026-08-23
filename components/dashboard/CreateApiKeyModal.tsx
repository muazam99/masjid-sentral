"use client";

import { useState } from "react";
import { KeyRound, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createApiKey } from "@/lib/api";
import { ApiKey } from "@/types/ApiKey";

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newKey: ApiKey) => void;
}

export function CreateApiKeyModal({ isOpen, onClose, onSuccess }: CreateApiKeyModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a key name");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await createApiKey(name.trim());
      setName("");
      onSuccess(result);
    } catch (err: any) {
      setError(err.message || "Failed to create API key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Create API Key</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="keyName" className="text-sm font-medium text-foreground">
              Key Name
            </label>
            <Input
              id="keyName"
              placeholder="e.g. My Website, Flutter App, Testing..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              autoFocus
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              Give your key a descriptive name to help you identify it later.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()} className="gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Generate Key
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
