import { PgSelect, PgTable } from "drizzle-orm/pg-core";
import { db } from "@nsa/server/db/connection";
import { QueryParams } from "@nsa/server/types";

export async function paginateQuery<T extends PgSelect>(
  table: PgTable,
  baseQuery: T,
  queryParams?: QueryParams,
) {
  const defaultLimit = queryParams?.limit ? queryParams.limit : 10;
  const defaultPage = queryParams?.page ? queryParams.page : 1;

  const rowCount = await db.$count(table);
  const totalPages = Math.ceil(rowCount / defaultLimit);

  const sqlStatement = baseQuery.limit(defaultLimit).offset((defaultPage - 1) * defaultLimit);
  const metadata = {
    totalCount: rowCount,
    currentPage: defaultPage,
    pageSize: defaultLimit,
    totalPages,
    hasNextPage: defaultPage + defaultLimit < rowCount && totalPages !== defaultPage,
    hasPreviousPage: defaultPage > 0 && defaultPage !== 1,
  };

  return { sqlStatement, metadata };
}
