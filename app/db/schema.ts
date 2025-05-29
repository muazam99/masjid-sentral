import {
  integer,
  pgTable,
  varchar,
  timestamp,
  text,
  jsonb,
  serial,
  pgView,
  boolean,
} from "drizzle-orm/pg-core";

// Tags Table
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Masjid Tags Table
export const masjidTags = pgTable("masjid_tags", {
  tagId: integer("tag_id")
    .references(() => tags.id)
    .notNull(),
  masjidId: integer("masjid_id")
    .references(() => masjid.id)
    .notNull(),
});

// Districts Table (previously classTable)
export const districts = pgTable("districts", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id"),
  group: varchar("group", { length: 255 }).notNull(),
  key: varchar("key", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Masjid Table
export const masjid = pgTable("masjid", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 255 }),
  image_urls: jsonb().$type<string[]>(),
  description: text("description"),
  qrImageUrl: varchar("qr_image_url", { length: 255 }),
  qrContent: varchar("qr_content", { length: 255 }),
  supportedPayments: text("supported_payments"),
  googleMapsEmbedded: varchar("google_maps_embedded", { length: 255 }),
  googleMapsUrl: varchar("google_maps_url", { length: 255 }),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  address: varchar("address", { length: 255 }),
  countryId: integer("country_id").references(() => districts.id),
  stateId: integer("state_id").references(() => districts.id),
  cityId: integer("city_id").references(() => districts.id),
  tiktokUrl: varchar("tiktok_url", { length: 255 }),
  facebookUrl: varchar("facebook_url", { length: 255 }),
  whatsappNo: varchar("whatsapp_no", { length: 255 }),
  contactNo: varchar("contact_no", { length: 255 }),
  faxNo: varchar("fax_no", { length: 255 }),
  category: varchar("category", { length: 50 }),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  addedByUserId: integer("added_by_user_id")
    .references(() => user.id)
    .default(1),
});

export const masjidListView = pgView("masjid_list_vw", {
  id: integer("id"),
  name: varchar("name", { length: 255 }),
  imageUrl: varchar("image_url", { length: 255 }),
  countryName: varchar("country_name", { length: 255 }),
  stateId: integer("state_id"),
  cityId: integer("city_id"),
  stateName: varchar("state_name", { length: 255 }),
  cityName: varchar("city_name", { length: 255 }),
}).existing();

// Masjid Boards Table
export const masjidBoards = pgTable("masjid_boards", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  imageUrls: jsonb("image_urls"),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  userId: integer("user_id")
    .references(() => user.id)
    .notNull(),
  masjidId: integer("masjid_id")
    .references(() => masjid.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User Table
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  phone: varchar("phone", { length: 20 }),
  role: varchar("role", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});
