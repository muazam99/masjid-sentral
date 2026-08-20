"use client";

import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { QRCodeSVG } from "qrcode.react";
import { QrCode } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { uploadImageFile } from "@/lib/api";
import { CreateMasjidFormValues } from "../schema";

export function SedekahSection() {
  const { watch, setValue, register } = useFormContext<CreateMasjidFormValues>();
  const enabled = watch("sedekahEnabled");
  const qrContent = watch("sedekahQrContent");
  const qrImage = watch("sedekahQrImage");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleQrUpload(file: File | undefined) {
    if (!file) return;
    setError(null);
    setValue("sedekahQrImage", { path: "", status: "uploading" });
    try {
      const path = await uploadImageFile(file);
      setValue("sedekahQrImage", { path, status: "done" });
    } catch (e) {
      setValue("sedekahQrImage", null);
      setError(e instanceof Error ? e.message : "Upload failed");
    }
  }

  return (
    <Card id="section-sedekah-information">
      <CardHeader>
        <CardTitle>Sedekah information</CardTitle>
        <CardDescription>Let visitors contribute directly to this masjid.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between gap-3 rounded-sm border border-border bg-background p-3.5">
          <div className="space-y-0.5">
            <p className="text-sm font-bold">Enable sedekah</p>
            <p className="text-xs text-muted-foreground">Show contribution information on the masjid profile</p>
          </div>
          <Switch checked={enabled} onCheckedChange={(v) => setValue("sedekahEnabled", v)} />
        </div>

        {enabled && (
          <>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleQrUpload(e.target.files?.[0])}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-[150px] w-[150px] shrink-0 flex-col items-center justify-center gap-2 rounded-md border border-border bg-background"
              >
                {qrContent ? (
                  <QRCodeSVG value={qrContent} size={120} />
                ) : (
                  <>
                    <QrCode className="h-7 w-7 text-primary" />
                    <span className="text-sm font-bold">
                      {qrImage?.status === "uploading" ? "Uploading…" : "Upload QR"}
                    </span>
                  </>
                )}
              </button>

              <div className="w-full flex-1 space-y-3.5">
                <div className="space-y-1.5">
                  <Label htmlFor="sedekahQrContent">QR content (preferred)</Label>
                  <Input
                    id="sedekahQrContent"
                    placeholder="Raw QR payload, e.g. DuitNow string"
                    {...register("sedekahQrContent")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="paymentLabel">Payment label</Label>
                  <Input
                    id="paymentLabel"
                    placeholder="DuitNow QR · Masjid name"
                    {...register("paymentLabel")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Input
                    id="instructions"
                    placeholder="Optional contribution guidance"
                    {...register("instructions")}
                  />
                </div>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );
}
