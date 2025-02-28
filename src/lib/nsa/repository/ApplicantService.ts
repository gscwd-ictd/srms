import { db } from "@srms/server/db/postgres";
import { I_ApplicantRepository } from "../interfaces/IApplicantRepository";
import { PgTable } from "drizzle-orm/pg-core";

export class ApplicantService implements I_ApplicantRepository {
  async create(): Promise<object> {
    throw new Error("Method not implemented.");
  }

  async findAll(): Promise<object[]> {
    throw new Error("Method not implemented.");
  }

  async findOneById(id: string): Promise<object> {
    throw new Error("Method not implemented.");
  }
}
