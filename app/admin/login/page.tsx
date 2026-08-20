"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });

    if (res.ok) {
      router.push(searchParams.get("next") || "/admin/masjid/new");
      router.refresh();
      return;
    }

    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    setError(body?.error || "Something went wrong");
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#102319] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-xl border border-[#355443] bg-[#172D20] p-8 shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F5A3B] text-white">
            <Landmark className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-white">Admin access</span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="passcode" className="text-[#DDE9DE]">
            Passcode
          </Label>
          <Input
            id="passcode"
            type="password"
            autoFocus
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="border-[#355443] bg-[#102319] text-white"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full bg-[#C7A34D] text-[#102319] hover:bg-[#E7C66A]">
          {loading ? "Checking…" : "Continue"}
        </Button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}
