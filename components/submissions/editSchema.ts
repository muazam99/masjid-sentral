import { z } from "zod";

// v1 edit submissions are flat-fields-only (no photos/facilities/contacts/sedekah/
// org-contacts editing yet) — mirrors the API's PATCHABLE_FIELDS in
// masjid-sentral-api/src/lib/masjid-writes.ts, minus the structural fields
// (type_id/state_id/country_id/city_id/source) that stay admin-only for now.
export const editMasjidSchema = z.object({
  name: z.string().min(1, "Masjid name is required"),
  about: z.string().optional(),
  jumaatAvailable: z.boolean(),
  address: z.string().min(1, "Address is required"),
  lat: z.number(),
  lng: z.number(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  googleUrl: z.string().optional(),
});

export type EditMasjidFormValues = z.infer<typeof editMasjidSchema>;
