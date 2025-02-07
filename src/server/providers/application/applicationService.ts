import { ApplicationRepository } from "@nsa/server/providers/application";
import {
  applications,
  applicants,
  applicantAddress,
  applicantHousehold,
  applicantDocs,
} from "@nsa/server/db/schemas";
import { db } from "@nsa/server/db/postgres";
import { eq } from "drizzle-orm";
import type {
  Application,
  ApplicationDetails,
  ApplicationStatus,
  CreateApplicant,
  CreateApplication,
  QueryParams,
} from "@nsa/server/types";
import { paginateQuery } from "@nsa/server/helpers";
import { NotFoundError } from "@nsa/server/errors";

export class ApplicationService implements ApplicationRepository {
  /**
   * Creates an application for new service connection.
   *
   * @param details Application details
   *
   * @param applicantDetails - address, household, documents, personal information
   *
   * @returns new application
   */
  public async createApplication(details: CreateApplication, applicant: CreateApplicant) {
    // Deconstruct applicant
    const { address, household, documents, ...rest } = applicant;

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
          applicationId: newApplication[0]!.id,
          ...rest,
        })
        .returning();

      // Insert applicant address data
      const newApplicantAddress = await tx
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
        .returning();

      // Insert applicant document data
      const newDocuments = await tx
        .insert(applicantDocs)
        .values({
          applicantId: newApplicant[0]!.id,
          ...documents,
        })
        .returning();

      return {
        ...newApplication[0]!,
        applicant: { ...newApplicant[0]! },
        address: { ...newApplicantAddress[0]! },
        household: { ...newHousehold[0]! },
        documents: { ...newDocuments[0]! },
      };
    });

    return res;
  }

  /**
   * Accepts a unique identifier ID to retreive application details.
   *
   * @param applicationId - The unique identifier of an application details you wish to retreive.
   *
   * @returns
   */
  async getApplicationDetailsById(applicationId: string) {
    const res = db
      .select({
        id: applications.id,
        type: applications.type,
        landmark: applications.landmark,
        nearestNeighbor: applications.nearestNeighbor,
        remarks: applications.remarks,
        status: applications.status,
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
      .where(eq(applications.id, applicationId))
      .prepare("get_application_details_by_application_id");

    const application = await res.execute();

    if (application.length === 0 || !application[0]) {
      throw new NotFoundError("Application details not found!");
    }

    return application[0];
  }

  /**
   * Gets all application details based on the provided query parameters.
   *
   * @param queryParams -
   * - `limit` - How manay rows you want to retreive on a single fetch.
   * - `page` - Traverse the results based on this value.
   *
   * @returns
   */
  async getAllApplicationDetails(queryParams?: QueryParams) {
    const sql = db
      .select({
        id: applications.id,
        type: applications.type,
        landmark: applications.landmark,
        nearestNeighbor: applications.nearestNeighbor,
        remarks: applications.remarks,
        status: applications.status,
        createdAt: applications.createdAt,
        updatedAt: applications.updatedAt,
        applicant: { ...applicants },
        address: { ...applicantAddress },
        household: { ...applicantHousehold },
        documents: { ...applicantDocs },
      })
      .from(applications)
      .innerJoin(applicants, eq(applicants.applicationId, applications.id))
      .innerJoin(applicantAddress, eq(applicantAddress.applicantId, applicants.id))
      .innerJoin(applicantHousehold, eq(applicantHousehold.applicantId, applicants.id))
      .innerJoin(applicantDocs, eq(applicantDocs.applicantId, applicants.id))
      .$dynamic();

    const result = await paginateQuery<ApplicationDetails>(
      "get_all_application_details",
      applications,
      sql,
      queryParams,
    );

    return result;
  }

  /**
   *
   * @param applicationId - The unique identifier of an application that needs to be updated.
   *
   * @param status - The updated status of an application.
   *
   * @returns
   */
  async updateApplicationStatus(applicationId: string, status: ApplicationStatus): Promise<Application> {
    // Before performing update, check first if the application exists.
    const stmtSelect = db
      .select()
      .from(applications)
      .where(eq(applications.id, applicationId))
      .prepare("select_application_before_status_update");

    const application = await stmtSelect.execute();

    if (application.length === 0) {
      throw new NotFoundError("Update failed. Application not found!");
    }

    // If the provided status is the same with the original, just return the current application.
    if (status === application[0]?.status) {
      return application[0];
    }

    // Perform update if NotFoundError was not thrown.
    const stmtUpdate = db
      .update(applications)
      .set({ status })
      .where(eq(applications.id, applicationId))
      .returning()
      .prepare("update_application_status");

    const updatedApplication = await stmtUpdate.execute();

    return updatedApplication[0]!;
  }
}
