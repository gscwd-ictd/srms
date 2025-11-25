import { apiReference } from "@scalar/hono-api-reference";
import { type AppOpenAPI } from "@srms/server/types/appTypes";
import packageJSON from "@/package.json";

export function configureOpenApi(app: AppOpenAPI) {
  // Raw Open API specs in JSON format
  app.doc("/v1/docs", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "Service Request Management System",
      description: "API Documentation.",
      contact: {
        email: "gensanwater.ictd@gmail.com",
        name: "General Santos City Water District",
        url: "https://gensanwater.gov.ph",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server 1",
      },
      {
        url: "http://localhost:3001",
        description: "Local server 2",
      },
      {
        url: "http://172.20.110.84:3000",
        description: "Remote office server.",
      },
    ],
    tags: [
      {
        name: "Utilities",
        description:
          "These are essential for monitoring, debugging, and ensuring system health, but are not part of the core business logic.",
      },
      {
        name: "Applications",
        description:
          "Handles the entire process of applying for a new water utility service connection, from initial submission to document verification.",
      },
      {
        name: "Serviceable Areas",
        description: "This is the definition for the tag, 'Serviceable Areas'.",
      },
    ],
  });

  // Interactive API documentation based on the Open API specs using Scalar
  app.get(
    "/v1/reference",
    apiReference({
      theme: "saturn",
      tagsSorter: "alpha",
      defaultHttpClient: {
        targetKey: "node",
        clientKey: "axios",
      },
      spec: {
        url: "/api/v1/docs",
      },
      metaData: {
        title: "OMMS API",
      },
    }),
  );
}
