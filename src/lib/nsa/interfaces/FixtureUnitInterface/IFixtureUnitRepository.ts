import { CreateFixtureUnit, FixtureUnit, UpdateFixtureUnit } from "../../types/fixtureUnit";

export interface I_FixtureUnitRepository {
  getFixtureUnitsByYear(year: number): Promise<FixtureUnit[]>;
  addFixtureUnit(data: CreateFixtureUnit): Promise<FixtureUnit>;
  addFixtureUnitsByFile(formData: FormData): Promise<FixtureUnit[]>;
  getFixtureUnitById(id: string): Promise<FixtureUnit>;
  deleteFixtureUnitById(id: string): Promise<FixtureUnit>;
  getFixtureUnitIdByName(name: string): Promise<string>;
  addFixtureUnitsByFile(formData: FormData): Promise<FixtureUnit[]>;
  updateFixtureUnit(data: UpdateFixtureUnit): Promise<FixtureUnit>;
}
