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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { CreateMasjidFormValues, MASJID_TYPES } from "../schema";

export function BasicInfoSection() {
  const { control, register } = useFormContext<CreateMasjidFormValues>();

  return (
    <Card id="section-basic-information">
      <CardHeader>
        <CardTitle>Basic information</CardTitle>
        <CardDescription>The essentials visitors see first.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_260px]">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Masjid name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the official name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="typeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MASJID_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="about">About</Label>
          <Textarea
            id="about"
            rows={4}
            placeholder="Describe the masjid, its community role, and useful visitor context."
            {...register("about")}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ToggleRow
            title="Jumaat available"
            help="Friday congregational prayer is held here"
            name="jumaatAvailable"
          />
          <div>
            <ToggleRow
              title="Public profile"
              help="Allow this record to appear in the directory"
              name="publicProfile"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Not saved yet — no backing field in the database.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ToggleRow({
  title,
  help,
  name,
}: {
  title: string;
  help: string;
  name: "jumaatAvailable" | "publicProfile";
}) {
  const { control } = useFormContext<CreateMasjidFormValues>();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex w-full items-center justify-between gap-3 rounded-md border border-border bg-background p-3.5">
          <div className="space-y-0.5">
            <p className="text-sm font-bold">{title}</p>
            <p className="text-xs text-muted-foreground">{help}</p>
          </div>
          <Switch checked={field.value} onCheckedChange={field.onChange} />
        </div>
      )}
    />
  );
}
