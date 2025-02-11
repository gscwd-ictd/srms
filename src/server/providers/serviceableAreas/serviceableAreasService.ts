import { CreateServiceableArea, PaginatedResult, QueryParams, ServiceableArea } from "@srms/server/types";
import { ServiceableAreasRepository } from "./serviceableAreasRepository";
import { createPolygon } from "@srms/server/helpers/postGIS";
import { db } from "@srms/server/db/postgres";
import { serviceableAreas } from "@srms/server/db/schemas";
import { paginateQuery } from "@srms/server/helpers";
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
        barangayName: data.barangayName,
        boundaries: JSON.stringify(boundaries),
      })
      .returning()
      .prepare("add_serviceable_area");

    const res = await stmt.execute();

    return res[0]!;
  }

  /**
   *
   * @param id
   * @returns
   */
  async getServiceableAreaById(id: string): Promise<ServiceableArea> {
    const stmt = db
      .select({
        id: serviceableAreas.id,
        barangayName: serviceableAreas.barangayName,
        boundaries: sql`ST_AsGeoJSON(boundaries)`,
      })
      .from(serviceableAreas)
      .where(eq(serviceableAreas.id, id))
      .prepare("get_serviceable_area_by_id");

    const res = await stmt.execute();

    if (res.length === 0 || !res[0]) {
      throw new NotFoundError("Serviceable area not found!");
    }

    return { ...res[0], boundaries: JSON.parse(res[0].boundaries) };
  }

  /**
   *
   * @param queryParams
   * @returns
   */
  async getAllServiceableAreas(queryParams?: QueryParams): Promise<PaginatedResult<ServiceableArea>> {
    const sql = db.select().from(serviceableAreas).$dynamic();

    const result = await paginateQuery<ServiceableArea>(
      "get_all_serviceable_areas",
      serviceableAreas,
      sql,
      queryParams,
    );

    return result;
  }
}
