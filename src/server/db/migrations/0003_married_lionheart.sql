CREATE TABLE "serviceable_areas" (
	"id" varchar PRIMARY KEY NOT NULL,
	"barangay_name" text NOT NULL,
	"boundaries" geometry(Polygon, 4326) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
