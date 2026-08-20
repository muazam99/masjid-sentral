"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signUpError } = await signUp.email({ name, email, password });

    if (!signUpError) {
      router.push(searchParams.get("next") || "/");
      router.refresh();
      return;
    }

    setError(signUpError.message || "Something went wrong");
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
          <span className="text-lg font-bold text-white">Create an account</span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-[#DDE9DE]">
            Name
          </Label>
          <Input
            id="name"
            autoFocus
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-[#355443] bg-[#102319] text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#DDE9DE]">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-[#355443] bg-[#102319] text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#DDE9DE]">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-[#355443] bg-[#102319] text-white"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full bg-[#C7A34D] text-[#102319] hover:bg-[#E7C66A]">
          {loading ? "Creating account…" : "Sign up"}
        </Button>

        <p className="text-center text-sm text-[#9DB3A6]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#E7C66A] hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
