import { AppRouteHandler } from "@nsa/server/helpers/types";
import { CreateApplicationRoute } from "./applications.routes";
import { ApplicationService } from "@nsa/lib/applicationService";

export const create: AppRouteHandler<CreateApplicationRoute> = async (c) => {
  const applicationService = new ApplicationService();

  const { details, applicant } = c.req.valid("json");

  const applicationDetails = await applicationService.createApplication(details, applicant);

  return c.json(applicationDetails, 200);
};
