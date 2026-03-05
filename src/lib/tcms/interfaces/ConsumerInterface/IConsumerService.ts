import { Consumer, ConsumerLedger, ConsumerLedgerEntry, ConsumerServiceRequests } from "../../types";

export interface I_ConsumerService {
  getConsumer(accountNo: string): Promise<Consumer>;
  getAllConsumerService(accountNo: string, year: string): Promise<ConsumerServiceRequests>;
  getAllConsumerLedger(accountNo: string, year: string): Promise<ConsumerLedger>;
  getConsumerLedgerLastEntry(accountNo: string, year: string): Promise<ConsumerLedgerEntry>;
}
