"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Plus, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateMasjidFormValues, FACILITY_OPTIONS } from "../schema";

export function FacilitiesSection() {
  const { watch, setValue } = useFormContext<CreateMasjidFormValues>();
  const facilities = watch("facilities");
  const [customFacility, setCustomFacility] = useState("");

  const knownValues = new Set(FACILITY_OPTIONS.map((f) => f.value));
  const customFacilities = facilities.filter((f) => !knownValues.has(f as (typeof FACILITY_OPTIONS)[number]["value"]));

  function toggle(value: string, checked: boolean) {
    setValue(
      "facilities",
      checked ? [...facilities, value] : facilities.filter((f) => f !== value)
    );
  }

  function addCustom() {
    const value = customFacility.trim();
    if (!value || facilities.includes(value)) return;
    setValue("facilities", [...facilities, value]);
    setCustomFacility("");
  }

  return (
    <Card id="section-facilities">
      <CardHeader>
        <CardTitle>Facilities</CardTitle>
        <CardDescription>What&apos;s available on-site.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {FACILITY_OPTIONS.map((facility) => (
            <label
              key={facility.value}
              className="flex h-[46px] items-center gap-2.5 rounded-sm border border-border bg-background px-3.5"
            >
              <Checkbox
                checked={facilities.includes(facility.value)}
                onCheckedChange={(checked) => toggle(facility.value, checked === true)}
              />
              <span className="text-sm font-semibold">{facility.label}</span>
            </label>
          ))}
        </div>

        {customFacilities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {customFacilities.map((facility) => (
              <span
                key={facility}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold"
              >
                {facility}
                <button type="button" onClick={() => toggle(facility, false)}>
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="Add another facility (e.g. bicycle parking)"
            value={customFacility}
            onChange={(e) => setCustomFacility(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addCustom} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
