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
import { Submission, EntityType } from "@/types/Submission";

export function SubmissionsQueueTable() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<EntityType | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Submission | null>(null);
  const [reviewNote, setReviewNote] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchAdminSubmissions("pending", selectedEntity)
      .then((data) => {
        setSubmissions(data);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load submissions"))
      .finally(() => setLoading(false));
  }, [selectedEntity]);

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

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-border pb-2">
        <Button
          variant={selectedEntity === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedEntity("all")}
        >
          All
        </Button>
        <Button
          variant={selectedEntity === "masjid" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedEntity("masjid")}
        >
          Masjids
        </Button>
        <Button
          variant={selectedEntity === "event" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedEntity("event")}
        >
          Events
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : submissions.length === 0 ? (
        <p className="text-muted-foreground">No pending submissions.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => {
            const payload = JSON.parse(submission.payload) as { name?: string; title?: string; start_at?: string };
            const displayName = payload.title ?? payload.name ?? `Submission #${submission.id}`;
            const entityLabel = submission.entity_type === "event" ? "Event" : "Masjid";

            return (
              <div key={submission.id} className="rounded-md border border-border bg-card p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {entityLabel}
                    </Badge>
                    <Badge variant={submission.type === "create" ? "default" : "secondary"}>
                      {submission.type === "create" ? "New" : "Edit"}
                    </Badge>
                    <span className="font-semibold">{displayName}</span>
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
        </div>
      )}

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
            placeholder="e.g. Inappropriate content or duplicate"
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

