"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CreateMasjidFormValues } from "../schema";

const LocationPickerMap = dynamic(() => import("../LocationPickerMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[210px] w-full items-center justify-center rounded-md border border-border bg-muted">
      <p className="text-xs text-muted-foreground">Loading map…</p>
    </div>
  ),
});

type Option = { id: string; name: string };

const COUNTRIES: Option[] = [
  { id: "my", name: "Malaysia" },
  { id: "sg", name: "Singapore" },
  { id: "bn", name: "Brunei" },
  { id: "id", name: "Indonesia" },
];

export function AddressLocationSection() {
  const { control, register, watch, setValue } = useFormContext<CreateMasjidFormValues>();
  const stateId = watch("stateId");
  const lat = watch("lat");
  const lng = watch("lng");

  const [states, setStates] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);

  useEffect(() => {
    fetch("/api/states?countryId=my")
      .then((res) => res.json() as Promise<unknown>)
      .then((data) => setStates(Array.isArray(data) ? (data as Option[]) : []))
      .catch(() => setStates([]));
  }, []);

  useEffect(() => {
    if (!stateId) {
      setCities([]);
      return;
    }
    fetch(`/api/cities?stateId=${stateId}`)
      .then((res) => res.json() as Promise<unknown>)
      .then((data) => setCities(Array.isArray(data) ? (data as Option[]) : []))
      .catch(() => setCities([]));
  }, [stateId]);

  return (
    <Card id="section-address-location">
      <CardHeader>
        <CardTitle>Address & location</CardTitle>
        <CardDescription>Where visitors will find this masjid.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Street and building address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_220px]">
          <FormField
            control={control}
            name="cityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City / district</FormLabel>
                <Select
                  value={field.value ?? undefined}
                  onValueChange={field.onChange}
                  disabled={!stateId}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select city or district" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <div className="space-y-1.5">
            <Label htmlFor="postcode">Postcode</Label>
            <Input id="postcode" placeholder="00000" {...register("postcode")} />
            <p className="text-xs text-muted-foreground">Not saved yet — no backing field in the database.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_260px]">
          <FormField
            control={control}
            name="stateId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {states.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="countryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_250px]">
          <LocationPickerMap
            latitude={lat}
            longitude={lng}
            onChange={(newLat, newLng) => {
              // Set both before validating — the schema validates lat/lng together, so
              // validating after only one is set would transiently fail and flash a stale error.
              setValue("lat", Math.round(newLat * 1e6) / 1e6);
              setValue("lng", Math.round(newLng * 1e6) / 1e6, { shouldValidate: true });
            }}
          />
          <div className="flex flex-col justify-center gap-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="lat">Latitude</Label>
              <Input id="lat" value={lat ?? ""} readOnly placeholder="3.1412" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lng">Longitude</Label>
              <Input id="lng" value={lng ?? ""} readOnly placeholder="101.6917" />
            </div>
          </div>
        </div>
        <FormField
          control={control}
          name="lat"
          render={() => <FormMessage />}
        />
      </CardContent>
    </Card>
  );
}
