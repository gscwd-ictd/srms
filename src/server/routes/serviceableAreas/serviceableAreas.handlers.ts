import { AppRouteHandler } from "@srms/server/types";
import { CreateNewServiceableArea } from "./serviceableAreas.routes";
import { db } from "@srms/server/db/postgres";
import { serviceableAreas } from "@srms/server/db/schemas";
import { createPolygon } from "@srms/server/helpers/postGIS";

export const createNewServiceableArea: AppRouteHandler<CreateNewServiceableArea> = async (c) => {
  const body = c.req.valid("json");

  const boundariesData = createPolygon(body.boundaries);

  console.log({ boundariesData });

  const res = await db
    .insert(serviceableAreas)
    .values({ barangayName: body.barangayName, boundaries: JSON.stringify(boundariesData) })
    .returning();

  return c.json(res[0]);
};
