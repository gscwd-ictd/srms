import { CreatePlumbingFixture, PlumbingFixture } from "../types/PlumbingFixture";

export interface I_PlumbingFixtureRepository {
  getAllPlumbingFixtures(): Promise<Array<PlumbingFixture>>;
  addPlumbingFixture(data: CreatePlumbingFixture): Promise<PlumbingFixture>;
  getPlumbingFixtureById(id: string): Promise<PlumbingFixture>;
  updatePlumbingFixtureById(id: string, data: CreatePlumbingFixture): Promise<PlumbingFixture>;
  deletePlumbingFixtureById(id: string): Promise<PlumbingFixture>;
}
