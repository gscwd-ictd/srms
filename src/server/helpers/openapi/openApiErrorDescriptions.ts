import * as HttpPhrases from "@nsa/server/constants/httpStatusPhrases";

export const openApiErrorDescriptions = {
  [HttpPhrases.OK]: `Success.`,
  [HttpPhrases.BAD_REQUEST]: `${HttpPhrases.BAD_REQUEST}. Usually due to missing or invalid parameters.`,
  [HttpPhrases.UNPROCESSABLE_ENTITY]: `${HttpPhrases.UNPROCESSABLE_ENTITY}. There is an entity validation error that you need to fix.`,
  [HttpPhrases.TOO_MANY_REQUESTS]: `${HttpPhrases.TOO_MANY_REQUESTS}. You have exceeded the rate limit set for this route.`,
  [HttpPhrases.INTERNAL_SERVER_ERROR]: `${HttpPhrases.INTERNAL_SERVER_ERROR}. Something has gone wrong on the server.`,
} as const;
