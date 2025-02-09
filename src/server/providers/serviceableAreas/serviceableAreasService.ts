import { CreateServiceableArea, ServiceableArea } from "@srms/server/types";
import { ServiceableAreasRepository } from "./serviceableAreasRepository";
import { createPolygon } from "@srms/server/helpers/postGIS";
import { db } from "@srms/server/db/postgres";
import { serviceableAreas } from "@srms/server/db/schemas";

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
}
