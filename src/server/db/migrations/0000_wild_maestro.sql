-- CREATE TYPE "public"."fixture_unit_type_enum" AS ENUM('private', 'public');--> statement-breakpoint
-- CREATE TYPE "public"."fixture_category_enum" AS ENUM('General', 'Sinks', 'Urinals');--> statement-breakpoint
CREATE TABLE  IF NOT EXISTS  "fixtures_unit" (
	"id" varchar PRIMARY KEY NOT NULL,
	"plumbing_fixtures_id_fk" varchar NOT NULL,
	"type" "fixture_unit_type_enum",
	"value" numeric(6, 3),
	"year" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "plumbing_fixtures" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" "fixture_category_enum" NOT NULL,
	"image_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "plumbing_fixtures_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "fixtures_unit" ADD CONSTRAINT "fixtures_unit_plumbing_fixtures_id_fk_plumbing_fixtures_id_fk" FOREIGN KEY ("plumbing_fixtures_id_fk") REFERENCES "public"."plumbing_fixtures"("id") ON DELETE no action ON UPDATE no action;