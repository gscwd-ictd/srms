import { I_FixtureUnitService } from "../interfaces/FixtureUnitInterface/IFixtureUnitService";
import { FixtureUnitRepository } from "../repositories/FixtureUnitsRepository";
import { FixtureUnit, CreateFixtureUnit } from "../types/fixtureUnit";

export class FixtureUnitService implements I_FixtureUnitService {
  constructor(private readonly fixtureUnitsRepository: FixtureUnitRepository) {}

  async getFixtureUnitsByYear(year: number): Promise<FixtureUnit[]> {
    return await this.fixtureUnitsRepository.getFixtureUnitsByYear(year);
  }
  async addFixtureUnit(data: CreateFixtureUnit): Promise<FixtureUnit> {
    return await this.fixtureUnitsRepository.addFixtureUnit(data);
  }
}
