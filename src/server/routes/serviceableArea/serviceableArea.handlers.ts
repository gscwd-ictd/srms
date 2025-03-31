import { AppRouteHandler } from "@srms/server/types/appTypes";
import { GetAllServiceableAreaRoute } from "./serviceableArea.routes";
import { nsaManager } from "@srms/server/app";

export const getAllServiceableAreas: AppRouteHandler<GetAllServiceableAreaRoute> = async (c) => {
  const serviceableArea = await nsaManager.getServiceableAreaService().getAllServiceableAreas();
  return c.json(serviceableArea, 200);
};
