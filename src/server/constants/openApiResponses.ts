import * as HttpPhrases from "@srms/utils/httpStatusPhrases";

export const OpenAPIResponses = {
  OK: "Success.",
  NOT_FOUND: `${HttpPhrases.NOT_FOUND}. The requested resource cannot be located.`,
  BAD_REQUEST: `${HttpPhrases.BAD_REQUEST}. Usually due to missing or invalid parameters.`,
  UNPROCESSABLE_ENTITY: `${HttpPhrases.UNPROCESSABLE_ENTITY}. There is an entity validation error that you need to fix.`,
  TOO_MANY_REQUESTS: `${HttpPhrases.TOO_MANY_REQUESTS}. You have exceeded the rate limit set for this route.`,
  INTERNAL_SERVER_ERROR: `${HttpPhrases.INTERNAL_SERVER_ERROR}. Something has gone wrong on the server.`,
} as const;
