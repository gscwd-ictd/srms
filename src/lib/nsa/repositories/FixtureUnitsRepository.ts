import { db } from "@srms/server/db/postgres";
import { I_FixtureUnitRepository } from "../interfaces/FixtureUnitInterface/IFixtureUnitRepository";
import { FixtureUnit, CreateFixtureUnit } from "../types/fixtureUnit";
import { fixtureUnits } from "@srms/server/db/schemas";
import { eq } from "drizzle-orm";
import { FixtureDoesNotExistError } from "../errors/FixtureUnitErrors/FixtureDoesNotExistsError";
import { PlumbingFixtureService } from "../services";
import { FixtureUnitsByYearDoNotExistError } from "../errors/FixtureUnitErrors/FixtureUnitsByYearDoNotExistError";

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
}
