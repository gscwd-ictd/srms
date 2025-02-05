import { AppRouteHandler } from "@nsa/server/types";
import {
  CreateApplicationRoute,
  GetAllApplicationDetailsRoute,
  GetApplicationDetailsByIdRoute,
} from "@nsa/server/routes/applications/applications.routes";
import { ApplicationService } from "@nsa/lib/applicationService";

export const createNewApplication: AppRouteHandler<CreateApplicationRoute> = async (c) => {
  const appService = new ApplicationService();

  const { details, applicant } = c.req.valid("json");

  const newApplication = await appService.createApplication(details, applicant);

  return c.json(newApplication, 200);
};

export const getApplicationDetailsById: AppRouteHandler<GetApplicationDetailsByIdRoute> = async (c) => {
  const appService = new ApplicationService();

  const { id } = c.req.valid("param");

  const applicationDetails = await appService.getApplicationDetailsById(id);

  return c.json(applicationDetails, 200);
};

export const getAllApplications: AppRouteHandler<GetAllApplicationDetailsRoute> = async (c) => {
  const appService = new ApplicationService();

  const queryParams = c.req.valid("query");

  const allApplicationDetails = await appService.getAllApplicationDetails(queryParams);

  return c.json(allApplicationDetails, 200);
};
