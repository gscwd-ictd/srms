import { db } from "@srms/server/db/postgres";
import { I_FixtureUnitRepository } from "../interfaces/FixtureUnitInterface/IFixtureUnitRepository";
import { FixtureUnit, CreateFixtureUnit, UpdateFixtureUnit } from "../types/fixtureUnit";
import { fixtureUnits } from "@srms/server/db/schemas";
import { FixtureDoesNotExistError } from "../errors/FixtureUnitErrors/FixtureDoesNotExistsError";
import { PlumbingFixtureService } from "../services";
import { FixtureUnitsByYearDoNotExistError } from "../errors/FixtureUnitErrors/FixtureUnitsByYearDoNotExistError";
import { eq } from "drizzle-orm";
import { FixtureUnitIdIsRequiredError } from "../errors/FixtureUnitErrors/FixtureUnitIdIsRequiredError";
import { FixtureUnitDoesNotExistsError } from "../errors/FixtureUnitErrors/FixtureUnitDoesNotExistsError";

export class FixtureUnitRepository implements I_FixtureUnitRepository {
  constructor(private readonly plumbingFixtureService: PlumbingFixtureService) {}

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
    const { plumbingFixturesId, id, type, value, year } = data;
    if (!id) throw new FixtureUnitIdIsRequiredError("Fixture Unit Id is required");
    await this.getFixtureUnitById(id);
    if (plumbingFixturesId) {
      const plumbingFixture = await this.plumbingFixtureService.getPlumbingFixtureById(plumbingFixturesId);
      if (!plumbingFixture) {
        throw new FixtureDoesNotExistError(`Plumbing/Fixture does not exists (id: ${plumbingFixturesId})`);
      }
      const result = await db
        .update(fixtureUnits)
        .set({ type, value, year, plumbingFixturesId, id })
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
