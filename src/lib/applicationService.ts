import { ApplicationRepository } from "@nsa/lib/applicationRepository";
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
import { eq } from "drizzle-orm";
import { NotFoundError } from "./errors/notFoundError";

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

  async getApplicationDetailsByApplicationId(
    id: string,
  ): Promise<z.infer<typeof SelectApplicationDetailsSchema>> {
    const res = db
      .select({
        id: applications.id,
        landmark: applications.landmark,
        nearestNeighbor: applications.nearestNeighbor,
        remarks: applications.remarks,
        createdAt: applications.createdAt,
        updatedAt: applications.updatedAt,
        applicant: { ...applicants },
        address: { ...applicantAddress },
        household: { ...applicantHousehold },
        documents: { ...applicantDocs },
      })
      .from(applicants)
      .innerJoin(applications, eq(applications.id, applicants.applicationId))
      .innerJoin(applicantAddress, eq(applicantAddress.applicantId, applicants.id))
      .innerJoin(applicantHousehold, eq(applicantHousehold.applicantId, applicants.id))
      .innerJoin(applicantDocs, eq(applicantDocs.applicantId, applicants.id))
      .where(eq(applications.id, id))
      .prepare("get_application_details_by_application_id");

    const application = await res.execute();

    if (application.length === 0) {
      throw new NotFoundError("Application details not found!");
    }

    return application[0];
  }
}
