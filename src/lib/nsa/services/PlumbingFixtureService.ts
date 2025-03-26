import { I_PlumbingFixtureRepository, I_PlumbingFixtureService } from "../interfaces";
import { CreatePlumbingFixture, PlumbingFixture, UpdatePlumbingFixture } from "../types";

export class PlumbingFixtureService implements I_PlumbingFixtureService {
  constructor(private readonly repository: I_PlumbingFixtureRepository) {}

  async getAllPlumbingFixtures(): Promise<PlumbingFixture[]> {
    return await this.repository.getAllPlumbingFixtures();
  }

  async addPlumbingFixture(data: CreatePlumbingFixture): Promise<PlumbingFixture> {
    return await this.repository.addPlumbingFixture(data);
  }

  async getPlumbingFixtureById(id: string): Promise<PlumbingFixture> {
    return await this.repository.getPlumbingFixtureById(id);
  }

  async updatePlumbingFixtureById(id: string, data: UpdatePlumbingFixture): Promise<PlumbingFixture> {
    return await this.repository.updatePlumbingFixtureById(id, data);
  }

  async deletePlumbingFixtureById(id: string): Promise<PlumbingFixture> {
    return await this.repository.deletePlumbingFixtureById(id);
  }
}
