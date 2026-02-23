import { Consumer, ConsumerLedger, ConsumerServiceRequests } from "../../types";

export interface I_ConsumerRepository {
  getConsumer(accountNo: string): Promise<Consumer>;
  getAllConsumerService(accountNo: string, year: string): Promise<ConsumerServiceRequests>;
  getAllConsumerLedger(accountNo: string, year: string): Promise<ConsumerLedger>;
}
