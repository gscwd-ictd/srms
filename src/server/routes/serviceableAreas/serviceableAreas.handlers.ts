import type { AppRouteHandler } from "@srms/server/types";
import {
  GetAllServiceableAreasRoute,
  GetServiceableAreaById,
  type CreateNewServiceableArea,
} from "@srms/server/routes/serviceableAreas/serviceableAreas.routes";
import { ServiceableAreaService } from "@srms/server/providers/serviceableAreas/serviceableAreasService";

const serviceableAreaService = new ServiceableAreaService();

export const createNewServiceableArea: AppRouteHandler<CreateNewServiceableArea> = async (c) => {
  const body = c.req.valid("json");

  const newServiceableArea = await serviceableAreaService.addServiceableArea(body);

  return c.json(newServiceableArea, 200);
};

export const getServiceableAreaById: AppRouteHandler<GetServiceableAreaById> = async (c) => {
  const param = c.req.valid("param");

  const serviceableArea = await serviceableAreaService.getServiceableAreaById(param.id);

  return c.json(serviceableArea, 200);
};

export const getAllServiceableAreas: AppRouteHandler<GetAllServiceableAreasRoute> = async (c) => {
  const queryParams = c.req.valid("query");

  const serviceableAreas = await serviceableAreaService.getAllServiceableAreas(queryParams);

  return c.json(serviceableAreas, 200);
};
