CREATE TYPE "public"."document_type" AS ENUM('proof of lot ownership', 'proof of billing', 'barangay certificate', 'valid id', 'selfie id');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('Male', 'Female');--> statement-breakpoint
CREATE TYPE "public"."application_status_enum" AS ENUM('pending_payment', 'for_survey', 'for_installation');--> statement-breakpoint
CREATE TYPE "public"."application_type_num" AS ENUM('New', 'Additional', 'Transfer');--> statement-breakpoint
CREATE TYPE "public"."fixture_category_enum" AS ENUM('General', 'Sinks', 'Urinals');--> statement-breakpoint
CREATE TABLE "applicant_address" (
	"id" varchar PRIMARY KEY NOT NULL,
	"applicant_id_fk" varchar NOT NULL,
	"lot_number" varchar,
	"block_number" varchar,
	"street" varchar,
	"purok_village_subdivision" varchar,
	"barangay" text,
	"city" varchar DEFAULT 'General Santos City' NOT NULL,
	"province" varchar DEFAULT 'South Cotabato' NOT NULL,
	"zip_code" varchar(4) DEFAULT '9500' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "applicant_documents" (
	"id" varchar PRIMARY KEY NOT NULL,
	"applicant_id_fk" varchar NOT NULL,
	"type" "document_type" NOT NULL,
	"document_paths" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "applicant_plumbing_fixtures" (
	"id" varchar PRIMARY KEY NOT NULL,
	"applicant_id_fk" varchar NOT NULL,
	"plumbing_fixture_id_fk" varchar NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "applicant_plumbing_fixtures_applicant_id_fk_plumbing_fixture_id_fk_unique" UNIQUE("applicant_id_fk","plumbing_fixture_id_fk")
);
--> statement-breakpoint
CREATE TABLE "applicant_household" (
	"id" varchar PRIMARY KEY NOT NULL,
	"applicant_id_fk" varchar NOT NULL,
	"number_of_persons" integer DEFAULT 0 NOT NULL,
	"number_of_houses" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "applicants" (
	"id" varchar PRIMARY KEY NOT NULL,
	"application_id_fk" varchar NOT NULL,
	"first_name" varchar NOT NULL,
	"middle_name" varchar,
	"last_name" varchar NOT NULL,
	"name_extension" varchar,
	"spouse" varchar,
	"gender" "gender" NOT NULL,
	"birthdate" date NOT NULL,
	"mobile_number" varchar NOT NULL,
	"email" varchar,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" varchar PRIMARY KEY NOT NULL,
	"type" "application_type_num",
	"landmark" text NOT NULL,
	"nearest_neighbor" text,
	"remarks" text,
	"status" "application_status_enum" DEFAULT 'pending_payment' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "fixtures_unit" (
	"id" varchar PRIMARY KEY NOT NULL,
	"plumbing_fixtures_id_fk" varchar NOT NULL,
	"public_value" numeric(6, 3),
	"private_value" numeric(6, 3),
	"year" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "plumbing_fixtures" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" "fixture_category_enum" NOT NULL,
	"file_path" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "plumbing_fixtures_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "serviceable_areas" (
	"id" varchar PRIMARY KEY NOT NULL,
	"barangay" text NOT NULL,
	"boundaries" geometry(MultiPolygon, 4326) NOT NULL,
	"details" text,
	"feature_styles" jsonb DEFAULT '{"fillColor":"rgb(197, 202, 233, 0.4)","strokeColor":"rgb(79, 70, 229, 1.0)","strokeWidth":[3],"outlineStyle":"solid","freehand":false,"enableSnapping":true,"snapTolerance":[7],"snapToEdge":true,"snapToVertex":true}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "serviceable_areas_barangay_unique" UNIQUE("barangay")
);
--> statement-breakpoint
ALTER TABLE "applicant_address" ADD CONSTRAINT "applicant_address_applicant_id_fk_applicants_id_fk" FOREIGN KEY ("applicant_id_fk") REFERENCES "public"."applicants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applicant_documents" ADD CONSTRAINT "applicant_documents_applicant_id_fk_applicants_id_fk" FOREIGN KEY ("applicant_id_fk") REFERENCES "public"."applicants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applicant_plumbing_fixtures" ADD CONSTRAINT "applicant_plumbing_fixtures_applicant_id_fk_applicants_id_fk" FOREIGN KEY ("applicant_id_fk") REFERENCES "public"."applicants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applicant_plumbing_fixtures" ADD CONSTRAINT "applicant_plumbing_fixtures_plumbing_fixture_id_fk_plumbing_fixtures_id_fk" FOREIGN KEY ("plumbing_fixture_id_fk") REFERENCES "public"."plumbing_fixtures"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applicant_household" ADD CONSTRAINT "applicant_household_applicant_id_fk_applicants_id_fk" FOREIGN KEY ("applicant_id_fk") REFERENCES "public"."applicants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_application_id_fk_applications_id_fk" FOREIGN KEY ("application_id_fk") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fixtures_unit" ADD CONSTRAINT "fixtures_unit_plumbing_fixtures_id_fk_plumbing_fixtures_id_fk" FOREIGN KEY ("plumbing_fixtures_id_fk") REFERENCES "public"."plumbing_fixtures"("id") ON DELETE no action ON UPDATE no action;