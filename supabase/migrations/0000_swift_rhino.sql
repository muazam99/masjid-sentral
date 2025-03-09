CREATE TABLE "districts" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"group" varchar(255) NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" varchar(255) NOT NULL,
	"label" varchar(255) NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "masjid_boards" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"body" text NOT NULL,
	"image_urls" jsonb,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"user_id" integer NOT NULL,
	"masjid_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "masjid" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"thumbnail_url" varchar(255),
	"image_urls" jsonb,
	"description" text,
	"qr_image_url" varchar(255),
	"qr_content" varchar(255),
	"supported_payments" jsonb,
	"google_maps_embedded" varchar(255),
	"google_maps_url" varchar(255),
	"latitude" varchar(50),
	"longitude" varchar(50),
	"address" varchar(255),
	"country_id" integer,
	"state_id" integer,
	"city_id" integer,
	"tiktok_url" varchar(255),
	"facebook_url" varchar(255),
	"whatsapp_no" varchar(255),
	"contact_no" varchar(255),
	"fax_no" varchar(255),
	"category" varchar(50),
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"added_by_user_id" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "masjid_tags" (
	"tag_id" integer NOT NULL,
	"masjid_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"fullname" varchar(255) NOT NULL,
	"phone" varchar(20),
	"role" varchar(50) NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "masjid_boards" ADD CONSTRAINT "masjid_boards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "masjid_boards" ADD CONSTRAINT "masjid_boards_masjid_id_masjid_id_fk" FOREIGN KEY ("masjid_id") REFERENCES "public"."masjid"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "masjid" ADD CONSTRAINT "masjid_country_id_districts_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."districts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "masjid" ADD CONSTRAINT "masjid_state_id_districts_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."districts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "masjid" ADD CONSTRAINT "masjid_city_id_districts_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."districts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "masjid" ADD CONSTRAINT "masjid_added_by_user_id_users_id_fk" FOREIGN KEY ("added_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "masjid_tags" ADD CONSTRAINT "masjid_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "masjid_tags" ADD CONSTRAINT "masjid_tags_masjid_id_masjid_id_fk" FOREIGN KEY ("masjid_id") REFERENCES "public"."masjid"("id") ON DELETE no action ON UPDATE no action;