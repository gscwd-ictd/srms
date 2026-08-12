import { isEmpty } from "@srms/utils/isEmpty";
import { db } from "@srms/server/db/mssql";
import { I_ConsumerRepository } from "../interfaces/ConsumerInterface/IConsumerRepository";
import {
  Consumer,
  ConsumerLedger,
  ConsumerLedgerEntry,
  Consumers,
  ConsumerServiceRequests,
  TableFilter,
} from "../types";
import { sql } from "drizzle-orm";

export class ConsumerRepository implements I_ConsumerRepository {
  async getConsumer(accountNo: string): Promise<Consumer> {
    const query = db.execute(sql`SELECT * FROM ViewConsumer_Info_omms WHERE account_no = ${accountNo} `);

    return (await query).recordset[0] as Consumer;
  }

  async getConsumers(pageIndex: string, pageSize: string, filters: TableFilter): Promise<Consumers> {
    const startIndex = parseInt(pageIndex) === 0 ? 0 : parseInt(pageIndex) * parseInt(pageSize);

    const dbQueryStatement = sql`SELECT account_no, meter_no, consumer_name, address, date_connected, status, description 
      FROM ViewConsumer_Info_omms `;

    // Loop through the table filters
    if (!isEmpty(filters)) {
      dbQueryStatement.append(sql`WHERE `);

      filters.map((filter, index) => {
        if (index === 0) {
          dbQueryStatement.append(sql`${sql.raw(filter.id)} LIKE '%${sql.raw(filter.value)}%' `);
        } else {
          dbQueryStatement.append(sql`AND ${sql.raw(filter.id)} LIKE '%${sql.raw(filter.value)}%' `);
        }
      });
    }

    // Add the index and limit per fetch to paginate
    dbQueryStatement.append(
      sql`ORDER BY account_no ASC OFFSET ${startIndex} ROWS FETCH NEXT ${parseInt(pageSize)} ROWS ONLY`,
    );

    const query = db.execute(dbQueryStatement);

    // Get total number of page by page size
    // const dbQueryTotalPages = sql`SELECT CEILING(CAST(COUNT(*) AS float) / ${parseInt(pageSize)} ) AS totalPages FROM ViewConsumer_Info_omms`;
    const dbQueryTotalPages = sql`SELECT COUNT(*) AS totalPages FROM ViewConsumer_Info_omms `;

    // Loop through the table filters
    if (!isEmpty(filters)) {
      dbQueryTotalPages.append(sql`WHERE `);

      filters.map((filter, index) => {
        if (index === 0) {
          dbQueryTotalPages.append(sql`${sql.raw(filter.id)} LIKE '%${sql.raw(filter.value)}%' `);
        } else {
          dbQueryTotalPages.append(sql`AND ${sql.raw(filter.id)} LIKE '%${sql.raw(filter.value)}%' `);
        }
      });
    }
    const query2 = db.execute(dbQueryTotalPages);

    const finalResult = {
      consumers: (await query).recordset,
      ...(await query2).recordset[0],
    };

    return finalResult as unknown as Consumers;
  }

  //get all consumers within range of polygon to be stored in zustand store for client side pagination
  async getConsumersByAccountNo(
    pageIndex: string, //not used
    pageSize: string, //not used
    filters: TableFilter,
  ): Promise<Consumers> {
    // const startIndex = parseInt(pageIndex) === 0 ? 0 : parseInt(pageIndex) * parseInt(pageSize);

    const dbQueryStatement = sql`SELECT account_no, meter_no, consumer_name, address, date_connected, status, description 
      FROM ViewConsumer_Info_omms `;

    // Group filters by column
    const groupedFilters = filters.reduce<Record<string, string[]>>((acc, filter) => {
      if (!acc[filter.id]) {
        acc[filter.id] = [];
      }

      acc[filter.id]?.push(filter.value);

      return acc;
    }, {});

    // Build WHERE clause
    if (!isEmpty(filters)) {
      dbQueryStatement.append(sql`WHERE `);

      const entries = Object.entries(groupedFilters);

      entries.forEach(([column, values], index) => {
        if (index > 0) {
          dbQueryStatement.append(sql` AND `);
        }

        dbQueryStatement.append(
          sql`${sql.raw(column)} IN (${sql.join(
            values.map((value) => sql`${value}`),
            sql`, `,
          )})`,
        );
      });
    }

    // Add the index and limit per fetch to paginate
    dbQueryStatement.append(sql`ORDER BY account_no`);
    // dbQueryStatement.append(
    //   sql`ORDER BY account_no ASC OFFSET ${startIndex} ROWS FETCH NEXT ${parseInt(pageSize)} ROWS ONLY`,
    // );

    const query = db.execute(dbQueryStatement);

    // Get total number of page by page size
    // const dbQueryTotalPages = sql`SELECT CEILING(CAST(COUNT(*) AS float) / ${parseInt(pageSize)} ) AS totalPages FROM ViewConsumer_Info_omms`;
    const dbQueryTotalPages = sql`
      SELECT COUNT(*) AS totalPages
      FROM ViewConsumer_Info_omms
    `;

    if (!isEmpty(filters)) {
      dbQueryTotalPages.append(sql`WHERE `);

      const entries = Object.entries(groupedFilters);

      entries.forEach(([column, values], index) => {
        if (index > 0) {
          dbQueryTotalPages.append(sql` AND `);
        }

        dbQueryTotalPages.append(
          sql`${sql.raw(column)} IN (${sql.join(
            values.map((value) => sql`${value}`),
            sql`, `,
          )})`,
        );
      });
    }
    const query2 = db.execute(dbQueryTotalPages);

    const finalResult = {
      consumers: (await query).recordset,
      ...(await query2).recordset[0],
    };

    return finalResult as unknown as Consumers;
  }

  async getAllConsumerService(accountNo: string, year?: string): Promise<ConsumerServiceRequests> {
    let query;

    if (!isEmpty(accountNo) && !isEmpty(year)) {
      query = await db.execute(
        sql`SELECT * FROM ViewConsumer_Services_omms WHERE account_no = ${accountNo} AND year(datetime_received) = ${year} ORDER BY datetime_received DESC`,
      );
    } else {
      query = db.execute(
        sql`SELECT * FROM ViewConsumer_Services WHERE account_no = ${accountNo} ORDER BY datetime_received DESC`,
      );
    }

    return (await query).recordset as unknown as ConsumerServiceRequests;
  }

  async getAllConsumerLedger(accountNo: string, year?: string): Promise<ConsumerLedger> {
    const query = db.execute(
      sql`SELECT * FROM ViewConsumer_Ledger_omms WHERE account_no = ${accountNo} AND billing_year = ${year} ORDER BY billing_month ASC`,
    );

    return (await query).recordset as unknown as ConsumerLedger;
  }

  async getConsumerLedgerLastEntry(accountNo: string, year: string): Promise<ConsumerLedgerEntry> {
    const query = db.execute(
      sql`SELECT TOP 1 * FROM ViewConsumer_Ledger WHERE account_no = ${accountNo} AND billing_year = ${year} ORDER BY billing_month DESC`,
    );

    return (await query).recordset[0] as unknown as ConsumerLedgerEntry;
  }
}
