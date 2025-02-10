import type { AppRouteHandler } from "@srms/server/types";
import { type CreateNewServiceableArea } from "@srms/server/routes/serviceableAreas/serviceableAreas.routes";
import { ServiceableAreaService } from "@srms/server/providers/serviceableAreas/serviceableAreasService";

const serviceableAreaService = new ServiceableAreaService();

export const createNewServiceableArea: AppRouteHandler<CreateNewServiceableArea> = async (c) => {
  const body = c.req.valid("json");

  const newServiceableArea = await serviceableAreaService.addServiceableArea(body);

  return c.json(newServiceableArea, 200);
};
