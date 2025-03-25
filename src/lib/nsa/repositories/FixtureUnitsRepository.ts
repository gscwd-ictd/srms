import { db } from "@srms/server/db/postgres";
import { I_FixtureUnitRepository } from "../interfaces/FixtureUnitInterface/IFixtureUnitRepository";
import { FixtureUnit, CreateFixtureUnit, UpdateFixtureUnit } from "../types/fixtureUnit";
import { fixtureUnits, plumbingFixtures } from "@srms/server/db/schemas";
import { FixtureDoesNotExistError } from "../errors/FixtureUnitErrors/FixtureDoesNotExistsError";
import { PlumbingFixtureService } from "../services";
import { FixtureUnitsByYearDoNotExistError } from "../errors/FixtureUnitErrors/FixtureUnitsByYearDoNotExistError";
import { eq, sql } from "drizzle-orm";
import { FixtureUnitIdIsRequiredError } from "../errors/FixtureUnitErrors/FixtureUnitIdIsRequiredError";
import { FixtureUnitDoesNotExistsError } from "../errors/FixtureUnitErrors/FixtureUnitDoesNotExistsError";
import csv from "csv-parser";
import { CsvFileIsRequiredError } from "../errors/FixtureUnitErrors/CsvFileIsRequiredError";
import { FileTypeNotAllowedError } from "../errors/FixtureUnitErrors/FileTypeNotAllowedError";
import { Readable } from "stream";

export class FixtureUnitRepository implements I_FixtureUnitRepository {
  constructor(private readonly plumbingFixtureService: PlumbingFixtureService) {}

  async addFixtureUnitsByFile(formData: FormData): Promise<FixtureUnit[]> {
    const file = formData.get("file") as File;
    if (!file) throw new CsvFileIsRequiredError("CSV file is required");
    if (file.type !== "text/csv") throw new FileTypeNotAllowedError("File Type is not allowed");
    const stream = Readable.from(Buffer.from(await file.arrayBuffer()));
    const data: FixtureUnit[] = [];
    const promises: Promise<void>[] = [];
    return new Promise((resolve) => {
      stream
        .pipe(csv())
        .on("data", async (row) => {
          const promise = (async () => {
            const plumbingFixturesId = await this.getFixtureUnitIdByName(row.plumbing_fixture);
            const fixtureUnit = await this.addFixtureUnit({
              plumbingFixturesId,
              privateValue: row.private_value,
              publicValue: row.public_value,
              year: row.year,
            });
            data.push(fixtureUnit);
          })();
          promises.push(promise);
        })
        .on("end", async () => {
          await Promise.all(promises);
          return resolve(data);
        });
    });
  }

  async getFixtureUnitIdByName(name: string): Promise<string> {
    const result = await db
      .select({ id: plumbingFixtures.id })
      .from(plumbingFixtures)
      .where(eq(sql`UPPER(REPLACE(${plumbingFixtures.name},' ',''))`, sql`UPPER(REPLACE(${name},' ',''))`));
    if (result.length === 0)
      throw new FixtureDoesNotExistError(`Fixture with the name ${name} does not exists`);
    return result[0]!.id;
  }

  async getFixtureUnitsByYear(year: number): Promise<FixtureUnit[]> {
    const result = await db.select().from(fixtureUnits).where(eq(fixtureUnits.year, year));
    if (result.length === 0)
      throw new FixtureUnitsByYearDoNotExistError(`There are no fixture units found on year: ${year}`);
    return result;
  }

  async addFixtureUnit(data: CreateFixtureUnit): Promise<FixtureUnit> {
    const { plumbingFixturesId } = data;
    const plumbingFixture = await this.plumbingFixtureService.getPlumbingFixtureById(plumbingFixturesId);
    if (!plumbingFixture) {
      throw new FixtureDoesNotExistError(`Plumbing/Fixture does not exists (id: ${plumbingFixturesId})`);
    }
    const result = await db.insert(fixtureUnits).values(data).returning();
    return result[0]!;
  }

  async getFixtureUnitById(id: string): Promise<FixtureUnit> {
    const fixtureUnit = await db.select().from(fixtureUnits).where(eq(fixtureUnits.id, id));
    if (fixtureUnit.length === 0) throw new FixtureUnitDoesNotExistsError("Fixture Unit does not exists");
    return fixtureUnit[0]!;
  }

  async updateFixtureUnit(data: UpdateFixtureUnit): Promise<FixtureUnit> {
    const { plumbingFixturesId, id, privateValue, publicValue, year } = data;
    if (!id) throw new FixtureUnitIdIsRequiredError("Fixture Unit Id is required");
    await this.getFixtureUnitById(id);
    if (plumbingFixturesId) {
      const plumbingFixture = await this.plumbingFixtureService.getPlumbingFixtureById(plumbingFixturesId);
      if (!plumbingFixture) {
        throw new FixtureDoesNotExistError(`Plumbing/Fixture does not exists (id: ${plumbingFixturesId})`);
      }
      const result = await db
        .update(fixtureUnits)
        .set({ privateValue, publicValue, year, plumbingFixturesId, id })
        .where(eq(fixtureUnits.id, id!))
        .returning();
      return result[0]!;
    }
    throw new FixtureDoesNotExistError(`Missing Plumbing Fixture Id`);
  }

  async deleteFixtureUnitById(id: string): Promise<FixtureUnit> {
    if (!id) throw new FixtureUnitIdIsRequiredError("Fixture Unit Id is required");
    await this.getFixtureUnitById(id);
    const result = await db.delete(fixtureUnits).where(eq(fixtureUnits.id, id!)).returning();
    return result[0]!;
  }
}
