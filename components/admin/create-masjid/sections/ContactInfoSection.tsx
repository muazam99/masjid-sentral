"use client";

import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CreateMasjidFormValues } from "../schema";

export function ContactInfoSection() {
  const { register } = useFormContext<CreateMasjidFormValues>();

  return (
    <Card id="section-contact-information">
      <CardHeader>
        <CardTitle>Contact information</CardTitle>
        <CardDescription>How visitors can reach the masjid office.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="contactDescription">Contact description</Label>
          <Textarea
            id="contactDescription"
            rows={3}
            placeholder="Explain what visitors can contact the masjid office about."
            {...register("contactDescription")}
          />
          <p className="text-xs text-muted-foreground">Not saved yet — no backing field in the database.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="+60" {...register("phone")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="office@example.com" {...register("email")} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="website">Official website</Label>
          <Input id="website" placeholder="https://" {...register("website")} />
          <p className="text-xs text-muted-foreground">
            Not saved yet — masjid_contacts only accepts facebook/instagram/twitter/youtube/whatsapp today.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
