import { AppRouteHandler } from "@nsa/server/helpers/types";
import {
  CreateApplicationRoute,
  GetApplicationDetailsByApplicationIdRoute,
} from "@nsa/server/routes/applications/applications.routes";
import { ApplicationService } from "@nsa/lib/applicationService";

export const createNewApplication: AppRouteHandler<CreateApplicationRoute> = async (c) => {
  const applicationService = new ApplicationService();

  const { details, applicant } = c.req.valid("json");

  const newApplication = await applicationService.createApplication(details, applicant);

  return c.json(newApplication, 200);
};

export const getApplicationDetailsByApplicationId: AppRouteHandler<
  GetApplicationDetailsByApplicationIdRoute
> = async (c) => {
  const applicationService = new ApplicationService();

  const { id } = c.req.valid("param");

  const applicationDetails = await applicationService.getApplicationDetailsByApplicationId(id);

  return c.json(applicationDetails, 200);
};
