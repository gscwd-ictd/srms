import type { AppRouteHandler } from "@srms/server/types";
import { ApplicationService } from "@srms/server/providers/application";
import {
  CreateApplicationRoute,
  GetAllApplicationDetailsRoute,
  GetApplicationDetailsByIdRoute,
  UpdateApplicationStatusRoute,
} from "@srms/server/routes/applications/applications.routes";

const applicationService = new ApplicationService();

export const createNewApplication: AppRouteHandler<CreateApplicationRoute> = async (c) => {
  const { details, applicant } = c.req.valid("json");

  const newApplication = await applicationService.createApplication(details, applicant);

  return c.json(newApplication, 200);
};

export const getApplicationDetailsById: AppRouteHandler<GetApplicationDetailsByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const applicationDetails = await applicationService.getApplicationDetailsById(id);

  return c.json(applicationDetails, 200);
};

export const getAllApplicationDetails: AppRouteHandler<GetAllApplicationDetailsRoute> = async (c) => {
  const queryParams = c.req.valid("query");

  const allApplicationDetails = await applicationService.getAllApplicationDetails(queryParams);

  return c.json(allApplicationDetails, 200);
};

export const updateApplicationStatus: AppRouteHandler<UpdateApplicationStatusRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const { status } = c.req.valid("json");

  const updatedApplication = await applicationService.updateApplicationStatus(id, status);

  return c.json(updatedApplication, 200);
};
