import type { PgSelect, PgTable } from "drizzle-orm/pg-core";
import type { PaginatedResult, QueryParams } from "@nsa/server/types";
import { db } from "@nsa/server/db/postgres";
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
export async function paginateQuery<T extends PgSelect, R>(
  table: PgTable,
  baseQuery: T,
  queryParams?: QueryParams,
): Promise<PaginatedResult<R>> {
  const limit = queryParams?.limit || 10;

  const page = queryParams?.page || 1;

  const rowCount = await db.$count(table);

  const totalPages = Math.ceil(rowCount / limit);

  const stmt = baseQuery
    .limit(sql.placeholder("limit"))
    .offset(sql.placeholder("page"))
    .prepare("get_all_application_details");

  const result = await stmt.execute({ limit: limit, page: (page - 1) * limit });

  return {
    data: result as R[],
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
