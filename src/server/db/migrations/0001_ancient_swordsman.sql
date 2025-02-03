ALTER TABLE "applicant_household_info" RENAME TO "applicant_household";--> statement-breakpoint
ALTER TABLE "applicant_household" DROP CONSTRAINT "applicant_household_info_applicant_id_fk_applicants_applicant_id_fk";
--> statement-breakpoint
ALTER TABLE "applicant_household" ADD CONSTRAINT "applicant_household_applicant_id_fk_applicants_applicant_id_fk" FOREIGN KEY ("applicant_id_fk") REFERENCES "public"."applicants"("applicant_id") ON DELETE no action ON UPDATE no action;