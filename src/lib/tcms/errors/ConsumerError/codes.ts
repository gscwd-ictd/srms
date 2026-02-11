export type ConsumerErrorCode =
  | "consumer_does_not_exist"
  | "consumer_services_does_not_exist"
  | "consumer_ledger_does_not_exist";

export type ConsumerErrorResponse = {
  code: ConsumerErrorCode;
  description?: string;
  status: number;
};
