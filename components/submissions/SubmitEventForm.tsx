"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitEventCreate, uploadImageFile } from "@/lib/api";

export function SubmitEventForm({ defaultMasjidId }: { defaultMasjidId?: number }) {
  const router = useRouter();
  const [masjidId, setMasjidId] = useState<string>(defaultMasjidId ? String(defaultMasjidId) : "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);
    try {
      const imageId = await uploadImageFile(file);
      setImagePaths((prev) => [...prev, imageId]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsedMasjidId = Number(masjidId);
    if (!parsedMasjidId || isNaN(parsedMasjidId)) {
      setError("Please provide a valid Masjid ID");
      return;
    }
    if (!title.trim()) {
      setError("Event title is required");
      return;
    }
    if (!startAt) {
      setError("Start date and time are required");
      return;
    }

    setSubmitting(true);
    try {
      await submitEventCreate({
        masjid_id: parsedMasjidId,
        title: title.trim(),
        description: description.trim() || null,
        start_at: new Date(startAt).toISOString(),
        end_at: endAt ? new Date(endAt).toISOString() : null,
        status: "active",
        images: imagePaths.map((path, idx) => ({
          path,
          is_thumbnail: idx === 0,
          sort_order: idx,
        })),
      });

      router.push("/submit/thanks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit event");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-border bg-card p-6">
      {error && <div className="rounded bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <div className="space-y-2">
        <label className="text-sm font-semibold">Masjid ID *</label>
        <Input
          type="number"
          placeholder="e.g. 101"
          value={masjidId}
          onChange={(e) => setMasjidId(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">The ID of the masjid hosting this event</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Event Title *</label>
        <Input
          placeholder="e.g. Kuliah Maghrib Khas / Solat Hajat Perdana"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Start Date & Time *</label>
          <Input
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">End Date & Time</label>
          <Input
            type="datetime-local"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Description</label>
        <Textarea
          placeholder="Describe the event, speaker details, target audience, etc."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Poster / Images</label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploadingImage}
        />
        {uploadingImage && <p className="text-xs text-muted-foreground">Uploading image…</p>}
        {imagePaths.length > 0 && (
          <p className="text-xs text-green-600 font-medium">
            ✓ {imagePaths.length} image(s) attached
          </p>
        )}
      </div>

      <Button type="submit" disabled={submitting || uploadingImage} className="w-full sm:w-auto">
        {submitting ? "Submitting…" : "Submit Event for Review"}
      </Button>
    </form>
  );
}
