import type { AppRouteHandler } from "@srms/server/types/appTypes";
import {
  CreateApplicationRoute,
  GetAllApplicationDetailsRoute,
  UpdateApplicationStatusRoute,
} from "@srms/server/routes/applications/applications.routes";

export const createNewApplication: AppRouteHandler<CreateApplicationRoute> = async (c) => {
  return c.json({}, 200);
};

export const getAllApplicationDetails: AppRouteHandler<GetAllApplicationDetailsRoute> = async (c) => {
  return c.json({}, 200);
};

export const updateApplicationStatus: AppRouteHandler<UpdateApplicationStatusRoute> = async (c) => {
  return c.json({}, 200);
};
