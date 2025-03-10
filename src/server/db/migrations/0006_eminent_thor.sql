ALTER TABLE "serviceable_areas" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "serviceable_areas" CASCADE;--> statement-breakpoint
ALTER TABLE "applicant_address" RENAME COLUMN "barangay_id_fk" TO "barangay";--> statement-breakpoint
ALTER TABLE "applicant_address" DROP CONSTRAINT "applicant_address_barangay_id_fk_serviceable_areas_id_fk";
--> statement-breakpoint
ALTER TABLE "applicant_docs" ALTER COLUMN "proof_of_lot_ownership" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "applicant_docs" ALTER COLUMN "proof_of_billing" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "applicant_docs" ALTER COLUMN "barangay_certificate" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "applicant_docs" ALTER COLUMN "valid_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "applicant_docs" ALTER COLUMN "selfie_with_valid_id" SET DATA TYPE text;