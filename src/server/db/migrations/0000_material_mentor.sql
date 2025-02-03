CREATE TYPE "public"."gender" AS ENUM('Male', 'Female');--> statement-breakpoint
CREATE TABLE "applicant_address" (
	"applicant_address_id" varchar PRIMARY KEY NOT NULL,
	"applicant_id_fk" varchar,
	"lot_no" varchar,
	"block_no" varchar,
	"street" varchar,
	"prk_vill_subd" varchar,
	"barangay" varchar NOT NULL,
	"city" varchar DEFAULT 'General Santos City' NOT NULL,
	"province" varchar DEFAULT 'South Cotabato' NOT NULL,
	"zip_code" varchar(4) DEFAULT '9500' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "applicant_household_info" (
	"household_id" varchar PRIMARY KEY NOT NULL,
	"applicant_id_fk" varchar,
	"no_of_persons_in_household" integer DEFAULT 0 NOT NULL,
	"no_of_houses_in_lot" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "applicants" (
	"applicant_id" varchar PRIMARY KEY NOT NULL,
	"first_name" varchar NOT NULL,
	"middle_name" varchar,
	"last_name" varchar NOT NULL,
	"name_extension" varchar,
	"gender" "gender" NOT NULL,
	"birthdate" date NOT NULL,
	"mobile_no" varchar NOT NULL,
	"email" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"application_id" varchar PRIMARY KEY NOT NULL,
	"landmark" text,
	"nearest_neighbor" text,
	"remarks" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "applicant_address" ADD CONSTRAINT "applicant_address_applicant_id_fk_applicants_applicant_id_fk" FOREIGN KEY ("applicant_id_fk") REFERENCES "public"."applicants"("applicant_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applicant_household_info" ADD CONSTRAINT "applicant_household_info_applicant_id_fk_applicants_applicant_id_fk" FOREIGN KEY ("applicant_id_fk") REFERENCES "public"."applicants"("applicant_id") ON DELETE no action ON UPDATE no action;