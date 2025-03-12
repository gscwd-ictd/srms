import { CreateFixtureUnit, FixtureUnit } from "../../types/fixtureUnit";

export interface I_FixtureUnitService {
  getFixtureUnitsByYear(year: number): Promise<FixtureUnit[]>;
  addFixtureUnit(data: CreateFixtureUnit): Promise<FixtureUnit>;
}
