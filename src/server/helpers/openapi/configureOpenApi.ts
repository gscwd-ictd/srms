import { apiReference } from "@scalar/hono-api-reference";
import { type AppOpenAPI } from "@nsa/server/types";
import packageJSON from "@/package.json";

export function configureOpenApi(app: AppOpenAPI) {
  // Raw Open API specs in JSON format
  app.doc("/v1/docs", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "Online Application for New Service Connection",
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
        description: "Local server.",
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
