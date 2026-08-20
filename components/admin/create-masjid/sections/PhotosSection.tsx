"use client";

import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { ImagePlus, Image as ImageIcon, X, GripVertical, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { uploadImageFile } from "@/lib/api";
import { CreateMasjidFormValues } from "../schema";

export function PhotosSection() {
  const { watch, setValue } = useFormContext<CreateMasjidFormValues>();
  const thumbnail = watch("thumbnail");
  const images = watch("images");
  const [error, setError] = useState<string | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  async function handleThumbnailChange(file: File | undefined) {
    if (!file) return;
    setError(null);
    setValue("thumbnail", { path: "", status: "uploading" });
    try {
      const path = await uploadImageFile(file);
      setValue("thumbnail", { path, status: "done" });
    } catch (e) {
      setValue("thumbnail", null);
      setError(e instanceof Error ? e.message : "Upload failed");
    }
  }

  async function handleAddImages(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    const files = Array.from(fileList);
    const placeholders = files.map(() => ({ path: "", status: "uploading" as const }));
    setValue("images", [...images, ...placeholders]);

    for (const [i, file] of files.entries()) {
      try {
        const path = await uploadImageFile(file);
        setValue(
          `images.${images.length + i}`,
          { path, status: "done" },
          { shouldValidate: false }
        );
      } catch (e) {
        setValue(
          `images.${images.length + i}`,
          { path: "", status: "error" },
          { shouldValidate: false }
        );
        setError(e instanceof Error ? e.message : "Upload failed");
      }
    }
  }

  function removeImage(index: number) {
    setValue(
      "images",
      images.filter((_, i) => i !== index)
    );
  }

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    setValue("images", next);
  }

  return (
    <Card id="section-photos">
      <CardHeader>
        <CardTitle>Photos</CardTitle>
        <CardDescription>A thumbnail and a gallery of images.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleThumbnailChange(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => thumbnailInputRef.current?.click()}
            className="flex h-[112px] w-[180px] shrink-0 flex-col items-center justify-center gap-2 rounded-md border border-border bg-background"
          >
            {thumbnail?.status === "done" ? (
              <span className="text-xs font-bold text-foreground">Thumbnail set ✓</span>
            ) : (
              <>
                <ImagePlus className="h-6 w-6 text-primary" />
                <span className="text-sm font-bold">
                  {thumbnail?.status === "uploading" ? "Uploading…" : "Upload thumbnail"}
                </span>
              </>
            )}
          </button>
          <div className="space-y-1">
            <p className="text-sm font-bold">Thumbnail</p>
            <p className="text-sm text-muted-foreground">
              Used in directory cards and as the primary image for the masjid.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">Images</p>
          <input
            ref={imagesInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleAddImages(e.target.files)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => imagesInputRef.current?.click()}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" /> Add images
          </Button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((image, index) => (
              <div key={index} className="space-y-2 rounded-md border border-border bg-background p-2">
                <div className="flex h-[92px] items-center justify-center rounded-sm bg-muted">
                  <ImageIcon className="h-5.5 w-5.5 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => moveImage(index, -1)}
                    className="flex items-center gap-1 text-xs font-bold text-foreground"
                  >
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                    {index + 1}
                  </button>
                  <button type="button" onClick={() => removeImage(index)}>
                    <X className="h-3.5 w-3.5 text-destructive" />
                  </button>
                </div>
                {image.status === "uploading" && (
                  <p className="text-[10px] text-muted-foreground">Uploading…</p>
                )}
                {image.status === "error" && (
                  <p className="text-[10px] text-destructive">Failed</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
