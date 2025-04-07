import { db } from "@srms/server/db/postgres";
import {
  applicantAddress,
  applicantDocuments,
  applicantHousehold,
  applicantPlumbingFixtures,
  applicants,
  applications,
  applicationView,
} from "@srms/server/db/schemas";
import { I_ApplicantionRepository } from "../interfaces";
import { ApplicantDocs, Application, CreateApplication, UploadApplicationDocs } from "../types";
import { PaginatedResult, QueryParams } from "@srms/server/types/helperTypes";
import { paginateQuery } from "@srms/server/helpers/paginateQuery";
import { minioManager } from "@srms/server/app";
import { createFormData } from "@srms/utils/fileUtils";
import { desc, eq } from "drizzle-orm";
import { NotFoundError } from "../errors/codes";

export class ApplicantionRepository implements I_ApplicantionRepository {
  async getAllApplication(queryParams?: QueryParams): Promise<PaginatedResult<Application>> {
    // Construct the base query: select all from applicationView, ordered by latest createdAt
    const query = db.select().from(applicationView).orderBy(desc(applicationView.createdAt)).$dynamic();

    // Execute the paginated query with caching support (if applicable)
    const result = await paginateQuery<Application>(
      "get_all_application_details",
      applications,
      query,
      queryParams,
    );

    // Return the paginated dataset
    return result;
  }

  async addApplication(data: CreateApplication): Promise<Application> {
    // Deconstruct applicant
    const { applicant, address, household, fixtures, ...rest } = data;

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
              .values({ applicationId: newApplication[0]!.id, ...items })
              .returning();
          }),
        )
      ).flat();

      return {
        ...newApplication[0]!,
        applicant: { ...newApplicant[0]! },
        address: { ...newApplicantAddress[0]! },
        household: { ...newHousehold[0]! },
        fixtures: newFixtures,
      };
    });

    return res;
  }

  async getApplicationById(id: string): Promise<Application> {
    // Throw an error if no application ID is provided
    if (!id) {
      throw new NotFoundError("Invalid application ID: An ID must be provided");
    }

    // Prepare a SQL statement to select the application by ID
    const stmtSelect = db
      .select()
      .from(applicationView)
      .where(eq(applicationView.id, id))
      .prepare("get_application_by_id");

    // Execute the prepared statement and retrieve the result
    const rest = await stmtSelect.execute();

    // Return the first result (assuming there is always at least one result)
    return rest[0]!;
  }

  async uploadApplicationDocs(data: UploadApplicationDocs): Promise<ApplicantDocs> {
    // Extract relevant fields from input payload
    const { files, applicationId, type } = data;

    // Construct file storage path based on application context
    const filePath = `${applicationId}/${type}`;

    // Enforce allowed file types before processing
    const allowedFileTypes = ["image/jpeg", "image/jpg", "application/pdf", "image/png"];

    // Prepare files for upload
    const formData = createFormData(files, filePath);

    // Upload files to MinIO with type validation handled internally
    const uploadedFiles = (await minioManager.uploadFileBuffers(formData, { allowedFileTypes })) as string[];

    // Persist file metadata in the database
    const stmtInsert = db
      .insert(applicantDocuments)
      .values({ applicationId, type, files: uploadedFiles })
      .returning()
      .prepare("add_application_docs");

    // Execute the prepared statement and retrieve the result
    const res = await stmtInsert.execute();

    // Retrieve stored file paths from MinIO (excluding full URLs)
    const fileNames = (await minioManager.getFilesByFolder(filePath)).map((file) => file.name) as string[];

    // Return the updated document payload with normalized file paths
    return {
      ...res[0]!,
      files: fileNames,
    };
  }
}
