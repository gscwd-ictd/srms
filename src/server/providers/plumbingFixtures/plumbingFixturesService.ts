import { CreatePlumbingFixture, PlumbingFixture } from "@srms/server/types";
import { db } from "@srms/server/db/postgres";
import { plumbingFixtures } from "@srms/server/db/schemas/plumbingFixtures";
import { PlumbingFixturesRepository } from "./plumbingFixturesRepository";
import { minioManager } from "@srms/lib/minio";
import { eq } from "drizzle-orm";
import { NotFoundError } from "@srms/server/errors";
import { createFileFormData } from "@srms/utils/fileUtils";

export class PlumbingFixturesService implements PlumbingFixturesRepository {
  async getAllPlumbingFixtures(): Promise<Array<PlumbingFixture>> {
    // Step 1: Retrieve all plumbing fixtures from the database
    const sqlStmt = db.select().from(plumbingFixtures).prepare("get_all_plumbing_fixtures");
    const fixtures = await sqlStmt.execute();

    // Step 2: Fetch corresponding file data for each fixture
    const result = await Promise.all(
      fixtures.map(async (items) => {
        const file = (await minioManager.getFile(items.file)) as string;
        return {
          ...items,
          file: file,
        };
      }),
    );

    return result;
  }

  async addPlumbingFixture(data: CreatePlumbingFixture): Promise<PlumbingFixture> {
    // Step 1: Extract file information and other fields
    const { file, ...rest } = data;
    const filePath = `fixtures/${file.name}`;

    // Step 2: Insert the new plumbing fixture into the database
    const stmtInsert = db
      .insert(plumbingFixtures)
      .values({ file: filePath, ...rest })
      .returning()
      .prepare("add_plumbing_fixture");

    const res = await stmtInsert.execute();

    // Step 3: Handle file upload
    const formData = createFileFormData(file, filePath);
    await minioManager.uploadFileBuffer(formData);

    // Step 4: Retrieve the uploaded file
    const fileName = (await minioManager.getFile(res[0]!.file)) as string;

    return {
      ...res[0]!,
      file: fileName,
    };
  }

  async getPlumbingFixtureById(id: string): Promise<PlumbingFixture> {
    // Step 1: Check if the plumbing fixture exists
    const stmtSelect = db
      .select()
      .from(plumbingFixtures)
      .where(eq(plumbingFixtures.id, id))
      .prepare("get_plumbing_fixture_by_id");

    const res = await stmtSelect.execute();

    if (res.length === 0 || !res[0]) {
      throw new NotFoundError("Plumbing fixture not found!");
    }

    // Step 2: Retrieve the existing file from storage
    const file = (await minioManager.getFile(res[0].file)) as string;

    return {
      ...res[0],
      file: file,
    };
  }

  async updatePlumbingFixtureById(id: string, data: CreatePlumbingFixture): Promise<PlumbingFixture> {
    // Step 1: Check if the plumbing fixture exists
    const stmtSelect = db
      .select()
      .from(plumbingFixtures)
      .where(eq(plumbingFixtures.id, id))
      .prepare("get_plumbing_fixture_by_id");

    const plumbingFixture = await stmtSelect.execute();

    if (plumbingFixture.length === 0) {
      throw new NotFoundError("Update failed. Plumbing fixture not found!");
    }

    // Step 2: Extract file information and update fields
    const { file, ...updateFields } = data;
    const filePath = `fixtures/${file.name}`;

    // Step 3: Prepare the update statement
    const stmtUpdate = db
      .update(plumbingFixtures)
      .set({ file: filePath, ...updateFields })
      .where(eq(plumbingFixtures.id, id))
      .returning()
      .prepare("update_plumbing_fixture_by_id");

    // Step 4: Handle file storage (delete old file, upload new file)
    const formData = createFileFormData(file, filePath);
    await minioManager.deleteFile(plumbingFixture[0]!.file);
    await minioManager.uploadFileBuffer(formData);

    // Step 5: Execute the update and return the updated fixture
    const updatedFixture = await stmtUpdate.execute();
    return updatedFixture[0]!;
  }

  async deletePlumbingFixtureById(id: string): Promise<PlumbingFixture> {
    // Step 1: Check if the plumbing fixture exists
    const stmtSelect = db
      .select()
      .from(plumbingFixtures)
      .where(eq(plumbingFixtures.id, id))
      .prepare("get_plumbing_fixture_by_id");

    const plumbingFixture = await stmtSelect.execute();

    if (plumbingFixture.length === 0) {
      throw new NotFoundError("Delete failed. Plumbing fixture not found!");
    }

    // Step 2: Delete the associated file from storage
    await minioManager.deleteFile(plumbingFixture[0]!.file);

    // Step 3: Delete the plumbing fixture from the database
    const stmtDelete = db
      .delete(plumbingFixtures)
      .where(eq(plumbingFixtures.id, id))
      .returning()
      .prepare("delete_plumbing_fixture_by_id");

    const res = await stmtDelete.execute();

    return res[0]!;
  }
}
