import { z } from "zod";
import {
  SelectConsumer,
  SelectConsumerLedger,
  SelectConsumerLedgerEntry,
  SelectConsumerServiceRequest,
  SelectConsumerServiceRequests,
} from "../schemas";

export type Consumer = z.infer<typeof SelectConsumer>;

export type ConsumerServiceRequest = z.infer<typeof SelectConsumerServiceRequest>;

export type ConsumerServiceRequests = z.infer<typeof SelectConsumerServiceRequests>;

export type ConsumerLedgerEntry = z.infer<typeof SelectConsumerLedgerEntry>;

export type ConsumerLedger = z.infer<typeof SelectConsumerLedger>;
