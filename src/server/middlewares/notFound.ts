import { NOT_FOUND } from '@srms/utils/httpStatusCodes';
import { NOT_FOUND as NOT_FOUND_MESSAGE } from '@srms/utils/httpStatusPhrases';
import type { NotFoundHandler } from 'hono';
import type { AppBindings } from '@srms/server/types/appTypes';
import { jsonError } from '../helpers/jsonError';

export const notFound: NotFoundHandler<AppBindings> = c => {
  c.var.logger.error(`${NOT_FOUND_MESSAGE} - ${c.req.path}`);

  return jsonError(
    c,
    {
      status: NOT_FOUND,
      message: NOT_FOUND_MESSAGE,
      description: 'Make sure you requested the correct route path.',
      path: c.req.path,
    },
    NOT_FOUND,
  );
};
