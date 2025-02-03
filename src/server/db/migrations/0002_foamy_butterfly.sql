CREATE TABLE "applicant_docs" (
	"applicant_docs_id" varchar PRIMARY KEY NOT NULL,
	"applicant_id_fk" varchar NOT NULL,
	"proof_of_ownership" jsonb,
	"proof_of_billing" jsonb,
	"barangay_certificate" jsonb,
	"valid_id" jsonb,
	"selfie_with_valid_id" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "applicant_address" ALTER COLUMN "applicant_id_fk" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "applicant_household" ALTER COLUMN "applicant_id_fk" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "applicants" ADD COLUMN "application_id_fk" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "applicant_docs" ADD CONSTRAINT "applicant_docs_applicant_id_fk_applicants_applicant_id_fk" FOREIGN KEY ("applicant_id_fk") REFERENCES "public"."applicants"("applicant_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_application_id_fk_applications_application_id_fk" FOREIGN KEY ("application_id_fk") REFERENCES "public"."applications"("application_id") ON DELETE no action ON UPDATE no action;