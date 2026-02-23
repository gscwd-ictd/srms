import * as routes from "./tcms.routes";
import * as handlers from "./tcms.handler";
import { createOpenAPIRoute } from "@srms/server/openapi/createOpenApiRoute";

const tcms = createOpenAPIRoute()
  .openapi(routes.getConsumer, handlers.getConsumer)
  .openapi(routes.getAllConsumerServiceRequest, handlers.getAllConsumerServiceRequest)
  .openapi(routes.getAllConsumerLedger, handlers.getAllConsumerLedger);

export default tcms;
