import { isEmpty } from "@srms/utils/isEmpty";
import { db } from "@srms/server/db/mssql";
import { I_ConsumerRepository } from "../interfaces/ConsumerInterface/IConsumerRepository";
import { Consumer, ConsumerLedger, ConsumerLedgerEntry, ConsumerServiceRequests } from "../types";
import { sql } from "drizzle-orm";

export class ConsumerRepository implements I_ConsumerRepository {
  async getConsumer(accountNo: string): Promise<Consumer> {
    const query = db.execute(sql`SELECT * FROM ViewConsumer_Info_omms WHERE account_no = ${accountNo} `);

    return (await query).recordset[0] as Consumer;
  }

  async getAllConsumerService(accountNo: string, year?: string): Promise<ConsumerServiceRequests> {
    let query;

    if (!isEmpty(accountNo) && !isEmpty(year)) {
      query = await db.execute(
        sql`SELECT * FROM ViewConsumer_Services_omms WHERE account_no = ${accountNo} AND year(datetime_received) = ${year}`,
      );
    } else {
      query = db.execute(sql`SELECT * FROM ViewConsumer_Services WHERE account_no = ${accountNo} `);
    }

    return (await query).recordset as unknown as ConsumerServiceRequests;
  }

  async getAllConsumerLedger(accountNo: string, year?: string): Promise<ConsumerLedger> {
    const query = db.execute(
      sql`SELECT * FROM ViewConsumer_Ledger_omms WHERE account_no = ${accountNo} AND billing_year = ${year} ORDER BY billing_month ASC `,
    );

    return (await query).recordset as unknown as ConsumerLedger;
  }

  async getConsumerLedgerLastEntry(accountNo: string, year: string): Promise<ConsumerLedgerEntry> {
    const query = db.execute(
      sql`SELECT TOP 1 * FROM ViewConsumer_Ledger WHERE account_no = ${accountNo} AND billing_year = ${year} ORDER BY billing_month DESC`,
    );

    return (await query).recordset as unknown as ConsumerLedgerEntry;
  }
}
