"use client";

// Public "submit a new masjid" form — reuses the same sections/schema as the
// admin CreateMasjidForm (this repo's canonical react-hook-form + zod pattern),
// since a brand-new masjid submission supports the same full field set
// (photos, facilities, contacts, sedekah, org contacts). The only difference
// from CreateMasjidForm is where it posts (a pending review queue, not a live
// write) and where it sends the user afterwards.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { submitMasjidCreate } from "@/lib/api";
import {
  createMasjidSchema,
  CreateMasjidFormValues,
  CREATE_MASJID_DEFAULT_VALUES,
} from "@/components/admin/create-masjid/schema";
import { BasicInfoSection } from "@/components/admin/create-masjid/sections/BasicInfoSection";
import { AddressLocationSection } from "@/components/admin/create-masjid/sections/AddressLocationSection";
import { PhotosSection } from "@/components/admin/create-masjid/sections/PhotosSection";
import { FacilitiesSection } from "@/components/admin/create-masjid/sections/FacilitiesSection";
import { ContactInfoSection } from "@/components/admin/create-masjid/sections/ContactInfoSection";
import { SocialMediaSection } from "@/components/admin/create-masjid/sections/SocialMediaSection";
import { SedekahSection } from "@/components/admin/create-masjid/sections/SedekahSection";
import { OrganizationContactsSection } from "@/components/admin/create-masjid/sections/OrganizationContactsSection";
import { buildPayload } from "@/components/admin/create-masjid/CreateMasjidForm";

const STEPS = [
  { id: "section-basic-information", label: "Basic information" },
  { id: "section-address-location", label: "Address & location" },
  { id: "section-photos", label: "Photos" },
  { id: "section-facilities", label: "Facilities" },
  { id: "section-contact-information", label: "Contact information" },
  { id: "section-social-media", label: "Social media" },
  { id: "section-sedekah-information", label: "Sedekah information" },
  { id: "section-organization-contacts", label: "Organization contacts" },
];

export function SubmitMasjidForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm<CreateMasjidFormValues>({
    resolver: zodResolver(createMasjidSchema),
    defaultValues: CREATE_MASJID_DEFAULT_VALUES,
    mode: "onSubmit",
  });

  async function onSubmit(values: CreateMasjidFormValues) {
    setSubmitError(null);
    setSubmitting(true);
    try {
      await submitMasjidCreate(buildPayload(values));
      router.push("/submit/thanks");
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Failed to submit masjid");
      setSubmitting(false);
    }
  }

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="mx-auto max-w-[1440px] px-6 py-9 lg:px-16">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">Community submission</div>
          <h1 className="mb-2.5 text-3xl font-extrabold sm:text-4xl">Add a new masjid</h1>
          <p className="mb-7 max-w-[760px] text-muted-foreground">
            Your submission will be reviewed by an admin before it appears in the directory.
          </p>

          <div className="flex flex-col gap-6 lg:flex-row">
            <aside className="w-full shrink-0 lg:w-[260px]">
              <div className="sticky top-6 space-y-4">
                <div className="space-y-3 rounded-md border border-border bg-card p-4">
                  <p className="text-sm font-bold">Steps</p>
                  <div className="space-y-1">
                    {STEPS.map((step) => (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => scrollToSection(step.id)}
                        className="block w-full rounded-sm px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        {step.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? "Submitting…" : "Submit for review"}
                  </Button>
                  <Button type="button" variant="ghost" className="w-full" onClick={() => router.push("/directory")}>
                    Cancel
                  </Button>
                  {submitError && <p className="text-sm text-destructive">{submitError}</p>}
                </div>
              </div>
            </aside>

            <div className="flex-1 space-y-4.5">
              <BasicInfoSection />
              <AddressLocationSection />
              <PhotosSection />
              <FacilitiesSection />
              <ContactInfoSection />
              <SocialMediaSection />
              <SedekahSection />
              <OrganizationContactsSection />
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
