CREATE TYPE "public"."gender" AS ENUM('Male', 'Female');--> statement-breakpoint
CREATE TYPE "public"."application_status_enum" AS ENUM('pending_payment', 'for_survey', 'for_installation');--> statement-breakpoint
CREATE TYPE "public"."application_type_num" AS ENUM('New', 'Additional', 'Transfer');--> statement-breakpoint
CREATE TABLE "applicant_address" (
	"id" varchar PRIMARY KEY NOT NULL,
	"applicant_id_fk" varchar NOT NULL,
	"lot_no" varchar,
	"block_no" varchar,
	"street" varchar,
	"prk_vill_subd" varchar,
	"barangay_id_fk" varchar NOT NULL,
	"city" varchar DEFAULT 'General Santos City' NOT NULL,
	"province" varchar DEFAULT 'South Cotabato' NOT NULL,
	"zip_code" varchar(4) DEFAULT '9500' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "serviceable_areas" (
	"id" varchar PRIMARY KEY NOT NULL,
	"barangay_name" text NOT NULL,
	"boundaries" geometry(Polygon, 4326) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "applicant_docs" (
	"id" varchar PRIMARY KEY NOT NULL,
	"applicant_id_fk" varchar NOT NULL,
	"proof_of_ownership" jsonb NOT NULL,
	"proof_of_billing" jsonb NOT NULL,
	"barangay_certificate" jsonb NOT NULL,
	"valid_id" jsonb NOT NULL,
	"selfie_with_valid_id" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "applicant_household" (
	"id" varchar PRIMARY KEY NOT NULL,
	"applicant_id_fk" varchar NOT NULL,
	"no_of_persons_in_household" integer DEFAULT 0 NOT NULL,
	"no_of_houses_in_lot" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
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
	"mobile_no" varchar NOT NULL,
	"email" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" varchar PRIMARY KEY NOT NULL,
	"type" "application_type_num",
	"landmark" text,
	"nearest_neighbor" text,
	"remarks" text,
	"status" "application_status_enum" DEFAULT 'pending_payment' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "applicant_address" ADD CONSTRAINT "applicant_address_applicant_id_fk_applicants_id_fk" FOREIGN KEY ("applicant_id_fk") REFERENCES "public"."applicants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applicant_address" ADD CONSTRAINT "applicant_address_barangay_id_fk_serviceable_areas_id_fk" FOREIGN KEY ("barangay_id_fk") REFERENCES "public"."serviceable_areas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applicant_docs" ADD CONSTRAINT "applicant_docs_applicant_id_fk_applicants_id_fk" FOREIGN KEY ("applicant_id_fk") REFERENCES "public"."applicants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applicant_household" ADD CONSTRAINT "applicant_household_applicant_id_fk_applicants_id_fk" FOREIGN KEY ("applicant_id_fk") REFERENCES "public"."applicants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_application_id_fk_applications_id_fk" FOREIGN KEY ("application_id_fk") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;