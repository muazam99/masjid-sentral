"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { fetchMySubmissions } from "@/lib/api";
import { Submission, SubmissionStatus } from "@/types/Submission";

const STATUS_VARIANT: Record<SubmissionStatus, "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
};

export function MySubmissionsList() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMySubmissions()
      .then(setSubmissions)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load submissions"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (submissions.length === 0) return <p className="text-muted-foreground">You haven&apos;t submitted anything yet.</p>;

  return (
    <div className="space-y-3">
      {submissions.map((submission) => {
        const payload = JSON.parse(submission.payload) as { name?: string };
        return (
          <div key={submission.id} className="rounded-md border border-border bg-card p-4">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="font-semibold">{payload.name ?? `Submission #${submission.id}`}</span>
              <Badge variant={STATUS_VARIANT[submission.status]}>{submission.status}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {submission.type === "create" ? "New masjid" : "Edit"} · submitted{" "}
              {new Date(submission.created_at).toLocaleDateString()}
            </p>
            {submission.status === "rejected" && submission.review_note && (
              <p className="mt-2 text-sm text-destructive">Reason: {submission.review_note}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
