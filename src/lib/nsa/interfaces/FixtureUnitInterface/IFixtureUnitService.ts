import { CreateFixtureUnit, FixtureUnit, UpdateFixtureUnit } from "../../types/fixtureUnit";

export interface I_FixtureUnitService {
  getFixtureUnitsByYear(year: number): Promise<FixtureUnit[]>;
  addFixtureUnit(data: CreateFixtureUnit): Promise<FixtureUnit>;
  getFixtureUnitById(id: string): Promise<FixtureUnit>;
  deleteFixtureUnitById(id: string): Promise<FixtureUnit>;
  updateFixtureUnit(data: UpdateFixtureUnit): Promise<FixtureUnit>;
}
