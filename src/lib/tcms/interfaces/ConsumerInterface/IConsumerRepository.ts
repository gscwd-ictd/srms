import {
  Consumer,
  ConsumerLedger,
  ConsumerLedgerEntry,
  Consumers,
  ConsumerServiceRequests,
  TableFilter,
} from "../../types";

export interface I_ConsumerRepository {
  getConsumer(accountNo: string): Promise<Consumer>;
  getConsumers(pageIndex: string, pageSize: string, filters: TableFilter): Promise<Consumers>;
  getAllConsumerService(accountNo: string, year: string): Promise<ConsumerServiceRequests>;
  getAllConsumerLedger(accountNo: string, year: string): Promise<ConsumerLedger>;
  getConsumerLedgerLastEntry(accountNo: string, year: string): Promise<ConsumerLedgerEntry>;
}
