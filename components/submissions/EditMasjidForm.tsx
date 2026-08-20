"use client";

// Public "propose an edit" form — v1 scope is flat fields only (see editSchema.ts).
// Submits a `type: "update"` submission for admin review rather than writing
// directly to the live masjid record.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { submitMasjidUpdate, CreateMasjidPayload } from "@/lib/api";
import { Mosque } from "@/types/Mosque";
import { editMasjidSchema, EditMasjidFormValues } from "./editSchema";

export function EditMasjidForm({ mosque }: { mosque: Mosque & { id: number } }) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EditMasjidFormValues>({
    resolver: zodResolver(editMasjidSchema),
    defaultValues: {
      name: mosque.name ?? "",
      about: mosque.description ?? "",
      jumaatAvailable: mosque.jumaatAvailable ?? false,
      address: mosque.address ?? "",
      lat: mosque.latitude ?? 0,
      lng: mosque.longitude ?? 0,
      phone: mosque.phone ?? "",
      email: mosque.email ?? "",
      googleUrl: mosque.googleMapsUrl ?? "",
    },
  });

  async function onSubmit(values: EditMasjidFormValues) {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const payload: Partial<CreateMasjidPayload> = {
        name: values.name,
        description: values.about || null,
        jumaat_available: values.jumaatAvailable,
        address: values.address,
        lat: values.lat,
        lng: values.lng,
        telephone: values.phone || null,
        email: values.email || null,
        google_url: values.googleUrl || null,
      };
      await submitMasjidUpdate(mosque.id, payload);
      router.push("/submit/thanks");
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Failed to submit edit");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-9">
      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">Community submission</div>
      <h1 className="mb-2.5 text-3xl font-extrabold sm:text-4xl">Propose an edit</h1>
      <p className="mb-7 text-muted-foreground">
        Editing <strong>{mosque.name}</strong>. Your changes will be reviewed by an admin before they go live.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>Only these fields can be proposed for edit right now.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Masjid name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="about">About</Label>
              <Textarea id="about" rows={4} {...register("about")} />
            </div>

            <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-background p-3.5">
              <div className="space-y-0.5">
                <p className="text-sm font-bold">Jumaat available</p>
                <p className="text-xs text-muted-foreground">Friday congregational prayer is held here</p>
              </div>
              <Controller
                control={control}
                name="jumaatAvailable"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" rows={2} {...register("address")} />
              {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="lat">Latitude</Label>
                <Input id="lat" type="number" step="any" {...register("lat", { valueAsNumber: true })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lng">Longitude</Label>
                <Input id="lng" type="number" step="any" {...register("lng", { valueAsNumber: true })} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="googleUrl">Google Maps URL</Label>
              <Input id="googleUrl" {...register("googleUrl")} />
            </div>
          </CardContent>
        </Card>

        {submitError && <p className="text-sm text-destructive">{submitError}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit for review"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push(`/mosque/${mosque.id}`)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
