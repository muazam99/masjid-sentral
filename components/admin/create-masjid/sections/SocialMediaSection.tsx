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
import { Label } from "@/components/ui/label";
import { CreateMasjidFormValues } from "../schema";

export function SocialMediaSection() {
  const { register } = useFormContext<CreateMasjidFormValues>();

  return (
    <Card id="section-social-media">
      <CardHeader>
        <CardTitle>Social media</CardTitle>
        <CardDescription>Links people can follow for updates.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="facebook">Facebook</Label>
            <Input id="facebook" placeholder="Facebook URL" {...register("facebook")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="instagram">Instagram</Label>
            <Input id="instagram" placeholder="Instagram URL" {...register("instagram")} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="youtube">YouTube</Label>
            <Input id="youtube" placeholder="YouTube URL" {...register("youtube")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="additionalLink">Additional link</Label>
            <Input id="additionalLink" placeholder="Platform URL" {...register("additionalLink")} />
            <p className="text-xs text-muted-foreground">Not saved yet — no matching contact type in the database.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
