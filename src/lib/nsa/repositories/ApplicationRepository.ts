import { db } from "@srms/server/db/postgres";
import {
  applicantAddress,
  applicantHousehold,
  applicantPlumbingFixtures,
  applicants,
  applications,
} from "@srms/server/db/schemas";
import { I_ApplicantionRepository } from "../interfaces";
import { Application, CreateApplication } from "../types";
import { PaginatedResult, QueryParams } from "@srms/server/types/helperTypes";
import { eq, sql } from "drizzle-orm";
import { paginateQuery } from "@srms/server/helpers/paginateQuery";
import { minioManager } from "@srms/server/app";

export class ApplicantionRepository implements I_ApplicantionRepository {
  async getAllApplication(queryParams?: QueryParams): Promise<PaginatedResult<Application>> {
    const query = db
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
        fixtures: sql`json_agg(${applicantPlumbingFixtures})`.as("fixtures"),
      })
      .from(applications)
      .innerJoin(applicants, eq(applicants.applicationId, applications.id))
      .innerJoin(applicantAddress, eq(applicantAddress.applicantId, applicants.id))
      .innerJoin(applicantHousehold, eq(applicantHousehold.applicantId, applicants.id))
      .leftJoin(applicantPlumbingFixtures, eq(applicantPlumbingFixtures.applicantId, applicants.id))
      .groupBy(applications.id, applicants.id, applicantAddress.id, applicantHousehold.id)
      //.innerJoin(applicantDocs, eq(applicantDocs.applicantId, applicants.id))
      .$dynamic();

    const result = await paginateQuery<Application>(
      "get_all_application_details",
      applications,
      query,
      queryParams,
    );

    return result;
  }

  async addApplication(data: CreateApplication): Promise<Application> {
    // Deconstruct applicant
    const { applicant, address, household, fixtures, documents, ...rest } = data;

    // Implementation will handle:
    // 1. Start transaction
    // 2. Insert into applications table
    // 3. Insert into applicants table
    // 4. Insert into applicant address table
    // 5. Insert into applicant household table
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

      const newFixtures = (
        await Promise.all(
          fixtures.map(async (items) => {
            return await tx
              .insert(applicantPlumbingFixtures)
              .values({ applicantId: newApplicant[0]!.id, ...items })
              .returning();
          }),
        )
      ).flat();

      const newDocs = (
        await Promise.all(
          documents.map(async (items) => {
            /* 
              upload file = {

                name: applicantId + items.type
                source: items.pathNames
              }
            

            */

            const uploadFiles = items.pathNames.map((filePath, idx) => {
              const extension = filePath.split(".")[filePath.split(".").length - 1];
              return {
                name: newApplicant[0]!.id + "/" + items.type + "/" + idx + "." + extension,
                source: filePath,
              };
            });

            /*  const applicantId = newApplicant[0]!.id;
            const folderName = items.type;
            const files = items.pathNames; */
            const file = await minioManager.uploadFiles(uploadFiles);

            // return await tx
            //   .insert(applicantDocuments)
            //   .values({
            //     applicantId: newApplicant[0]!.id,
            //     ...items,
            //   })
            //   .returning();

            return file;
          }),
        )
      ).flat();

      return {
        ...newApplication[0]!,
        applicant: { ...newApplicant[0]! },
        address: { ...newApplicantAddress[0]! },
        household: { ...newHousehold[0]! },
        fixtures: newFixtures,
        documents: newDocs,
      };
    });

    return res;
  }
}
