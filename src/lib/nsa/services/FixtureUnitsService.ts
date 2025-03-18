import { I_FixtureUnitService } from "../interfaces/FixtureUnitInterface/IFixtureUnitService";
import { FixtureUnitRepository } from "../repositories/FixtureUnitsRepository";
import { FixtureUnit, CreateFixtureUnit, UpdateFixtureUnit } from "../types/fixtureUnit";

export class FixtureUnitService implements I_FixtureUnitService {
  constructor(private readonly fixtureUnitsRepository: FixtureUnitRepository) {}

  async getFixtureUnitsByYear(year: number): Promise<FixtureUnit[]> {
    return await this.fixtureUnitsRepository.getFixtureUnitsByYear(year);
  }
  async addFixtureUnit(data: CreateFixtureUnit): Promise<FixtureUnit> {
    return await this.fixtureUnitsRepository.addFixtureUnit(data);
  }
  async updateFixtureUnit(data: UpdateFixtureUnit): Promise<FixtureUnit> {
    return await this.fixtureUnitsRepository.updateFixtureUnit(data);
  }
  async getFixtureUnitById(id: string): Promise<FixtureUnit> {
    return await this.fixtureUnitsRepository.getFixtureUnitById(id);
  }
  async deleteFixtureUnitById(id: string): Promise<FixtureUnit> {
    return await this.fixtureUnitsRepository.deleteFixtureUnitById(id);
  }
}
