import { ServiceableAreaService } from "@srms/lib/servicableareas/services";
import { AppRouteHandler } from "@srms/server/types/appTypes";
import {
  AddServiceableAreaRoute,
  GetAllServiceableAreasRoute,
  GetServiceableAreaByIdRoute,
} from "./serviceableAreas.routes";
import memodb from "@srms/server/db/postgres";
import { sql } from "drizzle-orm";

const serviceableAreaService = new ServiceableAreaService();

export const addServiceableArea: AppRouteHandler<AddServiceableAreaRoute> = async (c) => {
  const body = c.req.valid("json");

  const newServiceableArea = await serviceableAreaService.addServiceableArea(body);

  return c.json(newServiceableArea, 200);
};

export const getAllServiceableAreas: AppRouteHandler<GetAllServiceableAreasRoute> = async (c) => {
  const serviceable = await memodb.execute(sql`SELECT * FROM serviceable_area`);

  return c.json(serviceable, 200);
};

// export const getAllServiceableAreas: AppRouteHandler<GetAllServiceableAreasRoute> = async (c) => {
//   const serviceableAreas = await serviceableAreaService.getAllServiceableAreas();

//   return c.json(serviceableAreas, 200);
// };

export const getServiceableAreaById: AppRouteHandler<GetServiceableAreaByIdRoute> = async (c) => {
  const params = c.req.valid("param");

  const serviceableArea = await serviceableAreaService.getServiceableAreaById(params.id);

  return c.json(serviceableArea, 200);
};
