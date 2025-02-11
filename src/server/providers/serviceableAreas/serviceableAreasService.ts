import {
  CreateServiceableArea,
  GeoJSONPolygon,
  ServiceableArea,
  ServiceableAreaGeoJSON,
} from "@srms/server/types";
import { ServiceableAreasRepository } from "./serviceableAreasRepository";
import { createPolygon } from "@srms/server/helpers/geo";
import { db } from "@srms/server/db/postgres";
import { serviceableAreas } from "@srms/server/db/schemas";
import { eq, sql } from "drizzle-orm";
import { NotFoundError } from "@srms/server/errors";

export class ServiceableAreaService implements ServiceableAreasRepository {
  /**
   *
   * @param data Details about the serviceable area.
   *
   * @returns
   */
  async addServiceableArea(data: CreateServiceableArea): Promise<ServiceableArea> {
    const boundaries = createPolygon(data.boundaries);

    const stmt = db
      .insert(serviceableAreas)
      .values({
        barangay: data.barangay,
        boundaries: JSON.stringify(boundaries),
      })
      .returning()
      .prepare("add_serviceable_area");

    const res = await stmt.execute();

    return res[0]!;
  }

  async getAllServiceableAreas(): Promise<ServiceableAreaGeoJSON[]> {
    const sqlStmt = db
      .select({
        id: serviceableAreas.id,
        barangay: serviceableAreas.barangay,
        boundaries: sql<GeoJSONPolygon>`ST_AsGeoJSON(boundaries)::jsonb`,
        createdAt: serviceableAreas.createdAt,
        updatedAt: serviceableAreas.updatedAt,
      })
      .from(serviceableAreas)
      .prepare("get_all_serviceable_areas");

    return await sqlStmt.execute();
  }

  async getServiceableAreaById(id: string): Promise<ServiceableAreaGeoJSON> {
    const sqlStmt = db
      .select({
        id: serviceableAreas.id,
        barangay: serviceableAreas.barangay,
        boundaries: sql<GeoJSONPolygon>`ST_AsGeoJSON(boundaries)::jsonb`,
        createdAt: serviceableAreas.createdAt,
        updatedAt: serviceableAreas.updatedAt,
      })
      .from(serviceableAreas)
      .where(eq(serviceableAreas.id, id))
      .prepare("get_serviceable_area_by_id");

    const res = await sqlStmt.execute();

    if (res.length === 0 || !res[0]) {
      throw new NotFoundError("Serviceable area not found!");
    }

    return res[0];
  }
}
