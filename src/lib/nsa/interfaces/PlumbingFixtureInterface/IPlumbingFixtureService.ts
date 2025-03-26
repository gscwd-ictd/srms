import { CreatePlumbingFixture, PlumbingFixture, UpdatePlumbingFixture } from "../../types";

export interface I_PlumbingFixtureService {
  getAllPlumbingFixtures(): Promise<PlumbingFixture[]>;
  addPlumbingFixture(data: CreatePlumbingFixture): Promise<PlumbingFixture>;
  getPlumbingFixtureById(id: string): Promise<PlumbingFixture>;
  updatePlumbingFixtureById(id: string, data: UpdatePlumbingFixture): Promise<PlumbingFixture>;
  deletePlumbingFixtureById(id: string): Promise<PlumbingFixture>;
}
