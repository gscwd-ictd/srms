import { I_ConsumerService } from "../interfaces";
import { ConsumerRepository } from "../repositories";
import {
  Consumer,
  ConsumerLedger,
  ConsumerLedgerEntry,
  Consumers,
  ConsumerServiceRequests,
  TableFilter,
} from "../types";

export class ConsumerService implements I_ConsumerService {
  constructor(private readonly repository: ConsumerRepository) {}

  async getConsumer(accountNo: string): Promise<Consumer> {
    return await this.repository.getConsumer(accountNo);
  }

  async getConsumers(pageIndex: string, pageSize: string, filters: TableFilter): Promise<Consumers> {
    return await this.repository.getConsumers(pageIndex, pageSize, filters);
  }

  async getAllConsumerService(accountNo: string, year?: string): Promise<ConsumerServiceRequests> {
    return await this.repository.getAllConsumerService(accountNo, year);
  }

  async getAllConsumerLedger(accountNo: string, year?: string): Promise<ConsumerLedger> {
    return await this.repository.getAllConsumerLedger(accountNo, year);
  }

  async getConsumerLedgerLastEntry(accountNo: string, year: string): Promise<ConsumerLedgerEntry> {
    return await this.repository.getConsumerLedgerLastEntry(accountNo, year);
  }
}
