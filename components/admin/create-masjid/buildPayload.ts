import { CreateMasjidPayload } from "@/lib/api";
import { CreateMasjidFormValues } from "./schema";

const CONTACT_TYPES = ["facebook", "instagram", "twitter", "youtube", "whatsapp"] as const;

export function buildPayload(values: CreateMasjidFormValues): CreateMasjidPayload {
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
