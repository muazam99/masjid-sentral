"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { fetchAdminSubmissions, approveSubmission, rejectSubmission } from "@/lib/api";
import { Submission } from "@/types/Submission";

export function SubmissionsQueueTable() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Submission | null>(null);
  const [reviewNote, setReviewNote] = useState("");

  useEffect(() => {
    fetchAdminSubmissions("pending")
      .then((data) => {
        setSubmissions(data);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load submissions"))
      .finally(() => setLoading(false));
  }, []);

  async function handleApprove(submission: Submission) {
    setBusyId(submission.id);
    try {
      await approveSubmission(submission.id);
      setSubmissions((prev) => prev.filter((s) => s.id !== submission.id));
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to approve");
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject() {
    if (!rejectTarget) return;
    setBusyId(rejectTarget.id);
    try {
      await rejectSubmission(rejectTarget.id, reviewNote);
      setSubmissions((prev) => prev.filter((s) => s.id !== rejectTarget.id));
      setRejectTarget(null);
      setReviewNote("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to reject");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading…</p>;
  }

  if (submissions.length === 0) {
    return <p className="text-muted-foreground">No pending submissions.</p>;
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}

      {submissions.map((submission) => {
        const payload = JSON.parse(submission.payload) as { name?: string };
        return (
          <div key={submission.id} className="rounded-md border border-border bg-card p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant={submission.type === "create" ? "default" : "secondary"}>
                  {submission.type === "create" ? "New masjid" : "Edit"}
                </Badge>
                <span className="font-semibold">{payload.name ?? `Submission #${submission.id}`}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(submission.created_at).toLocaleString()}
              </span>
            </div>

            <pre className="mb-3 max-h-48 overflow-auto rounded bg-muted p-3 text-xs">
              {JSON.stringify(payload, null, 2)}
            </pre>

            <div className="flex gap-2">
              <Button size="sm" disabled={busyId === submission.id} onClick={() => handleApprove(submission)}>
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={busyId === submission.id}
                onClick={() => setRejectTarget(submission)}
              >
                Reject
              </Button>
            </div>
          </div>
        );
      })}

      <AlertDialog open={rejectTarget !== null} onOpenChange={(open) => !open && setRejectTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject submission</AlertDialogTitle>
            <AlertDialogDescription>
              Explain why this submission is being rejected. The submitter will see this note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            value={reviewNote}
            onChange={(e) => setReviewNote(e.target.value)}
            placeholder="e.g. Duplicate of an existing masjid"
            rows={3}
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setReviewNote("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={!reviewNote.trim()} onClick={handleReject}>
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
