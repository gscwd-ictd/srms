import type { PgSelect, PgTable } from "drizzle-orm/pg-core";
import type { PaginatedResult, QueryParams } from "@srms/server/types/helperTypes";
import { db } from "@srms/server/db/postgres";
import { sql } from "drizzle-orm";

/**
 *
 * @param table Table from the database to retrieve data from and paginate the result.
 *
 * @param baseQuery The base query from which it will be extended to add `limit` and `offset`.
 *
 * @param queryParams Parameters to control the `limit` and `page` to return.
 *
 * @returns
 *  - `stmt`: A prepared statement to be executed.
 *  - `metadata`: Page and row count for the selected table.
 */
export async function paginateQuery<TResult>(
  preparedStmtName: string,
  table: PgTable,
  baseQuery: PgSelect,
  queryParams?: QueryParams,
): Promise<PaginatedResult<TResult>> {
  /**
   * Assign default value for `limit` if `queryParams.limit` is `undefined`
   */
  const limit = queryParams?.limit || 10;

  /**
   * Assign default value for `page` if `queryParams.page` is `undefined`
   */
  const page = queryParams?.page || 1;

  /**
   * Get row count for the selected table
   */
  const rowCount = await db.$count(table);

  /**
   * Calculate the total pages based on the `rowCount` and `limit`
   */
  const totalPages = Math.ceil(rowCount / limit);

  const stmt = baseQuery
    .limit(sql.placeholder("limit"))
    .offset(sql.placeholder("page"))
    .prepare(preparedStmtName);

  const result = await stmt.execute({ limit: limit, page: (page - 1) * limit });

  return {
    data: result as TResult[],
    metadata: {
      totalRowCount: rowCount,
      currentPageCount: result.length,
      currentPage: page,
      pageSize: limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
