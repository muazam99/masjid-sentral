"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { createMasjid, CreateMasjidPayload } from "@/lib/api";
import {
  createMasjidSchema,
  CreateMasjidFormValues,
  CREATE_MASJID_DEFAULT_VALUES,
} from "./schema";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { AddressLocationSection } from "./sections/AddressLocationSection";
import { PhotosSection } from "./sections/PhotosSection";
import { FacilitiesSection } from "./sections/FacilitiesSection";
import { ContactInfoSection } from "./sections/ContactInfoSection";
import { SocialMediaSection } from "./sections/SocialMediaSection";
import { SedekahSection } from "./sections/SedekahSection";
import { OrganizationContactsSection } from "./sections/OrganizationContactsSection";

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

const CONTACT_TYPES = ["facebook", "instagram", "twitter", "youtube", "whatsapp"] as const;

function buildPayload(values: CreateMasjidFormValues): CreateMasjidPayload {
  const images: CreateMasjidPayload["images"] = [];
  if (values.thumbnail?.status === "done") {
    images.push({ path: values.thumbnail.path, is_thumbnail: true, sort_order: 0 });
  }
  values.images.forEach((img, i) => {
    if (img.status === "done") {
      images.push({ path: img.path, is_thumbnail: false, sort_order: i + 1 });
    }
  });

  const contacts: CreateMasjidPayload["contacts"] = [];
  const socialByType: Record<(typeof CONTACT_TYPES)[number], string | undefined> = {
    facebook: values.facebook,
    instagram: values.instagram,
    twitter: undefined,
    youtube: values.youtube,
    whatsapp: undefined,
  };
  for (const type of CONTACT_TYPES) {
    const value = socialByType[type];
    if (value) contacts.push({ type, value });
  }

  const organization_contacts = values.organizationContacts
    .filter((c) => c.role.trim())
    .map((c, i) => ({
      role: c.role,
      description: c.description || null,
      parent_ref: c.parentIndex,
      sort_order: i,
    }));

  return {
    name: values.name,
    type_id: values.typeId,
    state_id: values.stateId,
    country_id: values.countryId,
    lat: values.lat as number,
    lng: values.lng as number,
    address: values.address,
    source: "manual",
    city_id: values.cityId,
    description: values.about || null,
    telephone: values.phone || null,
    email: values.email || null,
    jumaat_available: values.jumaatAvailable,
    facilities: values.facilities,
    contacts,
    images,
    sedekah: values.sedekahEnabled
      ? {
          enabled: true,
          qr_image_path: values.sedekahQrImage?.status === "done" ? values.sedekahQrImage.path : null,
          qr_content: values.sedekahQrContent || null,
          payment_label: values.paymentLabel || null,
          instructions: values.instructions || null,
        }
      : undefined,
    organization_contacts: organization_contacts.length > 0 ? organization_contacts : undefined,
  };
}

export function CreateMasjidForm() {
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
      const { id } = await createMasjid(buildPayload(values));
      router.push(`/mosque/${id}`);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Failed to create masjid");
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
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">Masjid profile</div>
          <h1 className="mb-2.5 text-3xl font-extrabold sm:text-4xl">Create a new masjid</h1>
          <p className="mb-7 max-w-[760px] text-muted-foreground">
            Add the public information visitors need to discover, contact, and understand this masjid.
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
                  <Button type="button" variant="outline" className="w-full">
                    Preview profile
                  </Button>
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? "Creating…" : "Create masjid"}
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
