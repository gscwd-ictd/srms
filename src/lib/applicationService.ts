import { ApplicationRepository } from "./applicationRepository";
import {
  applications,
  applicants,
  applicantAddress,
  applicantHousehold,
  applicantDocs,
} from "@nsa/server/db/schemas";
import { z } from "zod";
import { db } from "@nsa/server/db/connection";
import {
  CreateApplicationsSchema,
  SelectApplicationDetailsSchema,
} from "@nsa/server/validations/applicationSchema";
import { CreateApplicantsSchema } from "@nsa/server/validations/applicantSchema";

export class ApplicationService implements ApplicationRepository {
  public async createApplication(
    details: z.infer<typeof CreateApplicationsSchema>,
    { address, household, documents, ...applicant }: z.infer<typeof CreateApplicantsSchema>,
  ): Promise<z.infer<typeof SelectApplicationDetailsSchema>> {
    // Implementation will handle:
    // 1. Start transaction
    // 2. Insert into applications table
    // 3. Insert into applicants table
    // 4. Insert into applicant_address table
    // 5. Insert into applicant_household table
    // 6. Insert into applicant_docs table
    // 7. Commit transaction
    const res = await db.transaction(async (tx) => {
      // Insert application data
      const newApplication = await tx.insert(applications).values(details).returning();

      // Insert applicant data
      const newApplicant = await tx
        .insert(applicants)
        .values({
          applicationId: newApplication[0].id,
          ...applicant,
        })
        .returning();

      // Insert applicant address data
      const newApplicantAddress = await tx
        .insert(applicantAddress)
        .values({
          applicantId: newApplicant[0].id,
          ...address,
        })
        .returning();

      // Insert applicant household data
      const newHousehold = await tx
        .insert(applicantHousehold)
        .values({
          applicantId: newApplicant[0].id,
          ...household,
        })
        .returning();

      // Insert applicant document data
      const newDocuments = await tx
        .insert(applicantDocs)
        .values({
          applicantId: newApplicant[0].id,
          ...documents,
        })
        .returning();

      return {
        ...newApplication[0],
        applicant: { ...newApplicant[0] },
        address: { ...newApplicantAddress[0] },
        household: { ...newHousehold[0] },
        documents: { ...newDocuments[0] },
      };
    });

    return res;
  }
  getApplicationDetailsById(id: string): Promise<z.infer<typeof SelectApplicationDetailsSchema>> {
    throw new Error("Method not implemented.");
  }
}
