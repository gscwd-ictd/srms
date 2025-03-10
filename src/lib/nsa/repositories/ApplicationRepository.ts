import { db } from "@srms/server/db/postgres";
import { applicants, applications } from "@srms/server/db/schemas";
import { I_ApplicantionRepository } from "../interfaces";
import { Application, CreateApplication } from "../types";

export class ApplicantionRepository implements I_ApplicantionRepository {
  async addApplication(data: CreateApplication): Promise<Application> {
    // Deconstruct applicant
    const { applicant, address, /*household, */ /* documents, */ ...rest } = data;

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
      const newApplication = await tx
        .insert(applications)
        .values({ ...rest })
        .returning();

      // Insert applicant data
      const newApplicant = await tx
        .insert(applicants)
        .values({
          applicationId: newApplication[0]!.id,
          ...applicant,
        })
        .returning();

      // Insert applicant address data
      /*  const newApplicantAddress = await tx
        .insert(applicantAddress)
        .values({
          applicantId: newApplicant[0]!.id,
          ...address,
        })
        .returning();

      // Insert applicant household data
      const newHousehold = await tx
        .insert(applicantHousehold)
        .values({
          applicantId: newApplicant[0]!.id,
          ...household,
        })
        .returning(); */

      // Insert applicant document data
      /* const newDocuments = await tx
        .insert(applicantDocs)
        .values({
          applicantId: newApplicant[0]!.id,
          ...documents,
        })
        .returning(); */
      console.log(address);

      return {
        ...newApplication[0]!,
        applicant: { ...newApplicant[0]! },
        /* address: { ...newApplicantAddress[0]! },
        household: { ...newHousehold[0]! }, */
        //documents: { ...newDocuments[0]! },
      };
    });

    return res;
  }
}
