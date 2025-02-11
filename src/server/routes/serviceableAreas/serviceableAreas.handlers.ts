import type { AppRouteHandler } from "@srms/server/types";
import {
  GetAllServiceableAreasRoute,
  GetServiceableAreaByIdRoute,
  type AddServiceableAreaRoute,
} from "@srms/server/routes/serviceableAreas/serviceableAreas.routes";
import { ServiceableAreaService } from "@srms/server/providers/serviceableAreas/serviceableAreasService";

const serviceableAreaService = new ServiceableAreaService();

export const addServiceableArea: AppRouteHandler<AddServiceableAreaRoute> = async (c) => {
  const body = c.req.valid("json");

  const newServiceableArea = await serviceableAreaService.addServiceableArea(body);

  return c.json(newServiceableArea, 200);
};

export const getAllServiceableAreas: AppRouteHandler<GetAllServiceableAreasRoute> = async (c) => {
  const serviceableAreas = await serviceableAreaService.getAllServiceableAreas();

  return c.json(serviceableAreas, 200);
};

export const getServiceableAreaById: AppRouteHandler<GetServiceableAreaByIdRoute> = async (c) => {
  const params = c.req.valid("param");

  const serviceableArea = await serviceableAreaService.getServiceableAreaById(params.id);

  return c.json(serviceableArea, 200);
};
