import { z } from "zod";
import {
  TableFilter,
  SelectConsumer,
  SelectConsumerLedger,
  SelectConsumerLedgerEntry,
  SelectConsumers,
  SelectConsumerServiceRequest,
  SelectConsumerServiceRequests,
  SelectConsumerTcms,
} from "../schemas";

export type Consumer = z.infer<typeof SelectConsumer>;

export type ConsumerTcms = z.infer<typeof SelectConsumerTcms>;

export type Consumers = z.infer<typeof SelectConsumers>;

export type ConsumerServiceRequest = z.infer<typeof SelectConsumerServiceRequest>;

export type ConsumerServiceRequests = z.infer<typeof SelectConsumerServiceRequests>;

export type ConsumerLedgerEntry = z.infer<typeof SelectConsumerLedgerEntry>;

export type ConsumerLedger = z.infer<typeof SelectConsumerLedger>;

export type TableFilter = z.infer<typeof TableFilter>;
