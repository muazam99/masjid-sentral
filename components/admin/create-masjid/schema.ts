import { z } from "zod";

export const MASJID_TYPES = [
  { value: "masjid", label: "Masjid" },
  { value: "surau", label: "Surau" },
  { value: "musolla", label: "Musolla" },
] as const;

const uploadedImageSchema = z.object({
  path: z.string(),
  status: z.enum(["uploading", "done", "error"]),
});

const organizationContactSchema = z.object({
  role: z.string().min(1, "Role is required"),
  description: z.string().optional(),
  parentIndex: z.number().nullable(),
});

export const createMasjidSchema = z.object({
  // Basic information
  name: z.string().min(1, "Masjid name is required"),
  typeId: z.enum(["masjid", "surau", "musolla"]),
  about: z.string().optional(),
  jumaatAvailable: z.boolean(),
  publicProfile: z.boolean(),

  // Address & location
  address: z.string().min(1, "Address is required"),
  postcode: z.string().optional(),
  cityId: z.string().nullable(),
  stateId: z.string().min(1, "State is required"),
  countryId: z.string().min(1),
  lat: z.number().nullable(),
  lng: z.number().nullable(),

  // Photos
  thumbnail: uploadedImageSchema.nullable(),
  images: z.array(uploadedImageSchema),

  // Facilities
  facilities: z.array(z.string()),

  // Contact information
  contactDescription: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().optional(),

  // Social media
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
  additionalLink: z.string().optional(),

  // Sedekah information
  sedekahEnabled: z.boolean(),
  sedekahQrContent: z.string().optional(),
  sedekahQrImage: uploadedImageSchema.nullable(),
  paymentLabel: z.string().optional(),
  instructions: z.string().optional(),

  // Organization contacts
  organizationContacts: z.array(organizationContactSchema),
}).refine((data) => data.lat !== null && data.lng !== null, {
  message: "Pick a location on the map",
  path: ["lat"],
});

export type CreateMasjidFormValues = z.infer<typeof createMasjidSchema>;

export const CREATE_MASJID_DEFAULT_VALUES: CreateMasjidFormValues = {
  name: "",
  typeId: "masjid",
  about: "",
  jumaatAvailable: false,
  publicProfile: true,
  address: "",
  postcode: "",
  cityId: null,
  stateId: "",
  countryId: "my",
  lat: null,
  lng: null,
  thumbnail: null,
  images: [],
  facilities: [],
  contactDescription: "",
  phone: "",
  email: "",
  website: "",
  facebook: "",
  instagram: "",
  youtube: "",
  additionalLink: "",
  sedekahEnabled: false,
  sedekahQrContent: "",
  sedekahQrImage: null,
  paymentLabel: "",
  instructions: "",
  organizationContacts: [],
};

// Facilities checklist — matches the vocabulary FacilityChip.tsx already recognizes,
// extended with the remaining items from the Pencil design. Free text beyond this list is
// also accepted since masjid_facilities.facility is unconstrained TEXT.
export const FACILITY_OPTIONS = [
  { value: "women_prayer_space", label: "Women's prayer space" },
  { value: "wheelchair", label: "Wheelchair access" },
  { value: "wudhu", label: "Ablution area" },
  { value: "public_toilets", label: "Public toilets" },
  { value: "parking", label: "Parking nearby" },
  { value: "visitor_friendly", label: "Visitor-friendly areas" },
  { value: "jumaat_flow", label: "Friday prayer flow" },
  { value: "air_conditioned", label: "Air-conditioned halls" },
] as const;
