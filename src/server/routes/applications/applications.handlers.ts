import type { AppRouteHandler } from "@srms/server/types/appTypes";
import {
  CreateApplicationRoute,
  GetAllApplicationDetailsRoute,
  UpdateApplicationStatusRoute,
  UploadApplicantDocumentsRoute,
} from "@srms/server/routes/applications/applications.routes";
import { nsaManager } from "@srms/server/app";

export const getAllApplicationDetails: AppRouteHandler<GetAllApplicationDetailsRoute> = async (c) => {
  const applications = await nsaManager.getApplicationService().getAllApplication();
  return c.json(applications, 200);
};

export const createNewApplication: AppRouteHandler<CreateApplicationRoute> = async (c) => {
  const body = c.req.valid("json");

  const applications = await nsaManager.getApplicationService().addApplication(body);

  return c.json(applications, 200);
};

export const uploadApplicantDocuments: AppRouteHandler<UploadApplicantDocumentsRoute> = async (c) => {
  const body = c.req.valid("form");

  const uploadedDocuments = await nsaManager.getApplicationService().uploadApplicationDocs(body);

  return c.json(uploadedDocuments, 200);
};

export const updateApplicationStatus: AppRouteHandler<UpdateApplicationStatusRoute> = async (c) => {
  return c.json({}, 200);
};
