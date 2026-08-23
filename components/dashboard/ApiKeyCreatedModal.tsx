"use client";

import { useState } from "react";
import { Check, Copy, KeyRound, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApiKeyCreatedModalProps {
  apiKey: string;
  name: string;
  onClose: () => void;
}

export function ApiKeyCreatedModal({ apiKey, name, onClose }: ApiKeyCreatedModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">API Key Generated</h3>
            <p className="text-sm text-muted-foreground">Key created for: <span className="font-semibold text-foreground">{name}</span></p>
          </div>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 flex gap-3 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">
            <strong>Important:</strong> Please copy this secret key now. You will <strong>never</strong> be able to view it again once this window is closed.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Your Secret API Key
          </label>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/60 border border-border font-mono text-sm break-all">
            <span className="flex-1 select-all">{apiKey}</span>
            <Button
              size="sm"
              variant={copied ? "default" : "outline"}
              onClick={handleCopy}
              className="flex-shrink-0 gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={onClose} className="w-full sm:w-auto px-6">
            I have saved this key
          </Button>
        </div>
      </div>
    </div>
  );
}
