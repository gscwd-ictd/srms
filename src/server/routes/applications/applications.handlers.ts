import type { AppRouteHandler } from "@srms/server/types/appTypes";
import {
  CreateApplicationRoute,
  GetAllApplicationDetailsRoute,
  UpdateApplicationStatusRoute,
} from "@srms/server/routes/applications/applications.routes";
import { nsaManager } from "@srms/server/app";

export const createNewApplication: AppRouteHandler<CreateApplicationRoute> = async (c) => {
  const body = c.req.valid("json");

  const applications = await nsaManager.getApplicationService().addApplication(body);

  return c.json(applications, 200);
};

export const getAllApplicationDetails: AppRouteHandler<GetAllApplicationDetailsRoute> = async (c) => {
  const applications = await nsaManager.getApplicationService().getAllApplication();
  return c.json(applications, 200);
};

export const updateApplicationStatus: AppRouteHandler<UpdateApplicationStatusRoute> = async (c) => {
  return c.json({}, 200);
};
