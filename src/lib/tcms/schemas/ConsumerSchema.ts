import { z } from "zod";

export const SelectConsumer = z.object({
  account_no: z.string(),
  consumer_name: z.string(),
  address: z.string().nullable(),
  meter_no: z.string().nullable(),
  check_digit: z.number(),
  description: z.string().nullable(),
  status: z.string(),
  AverageUsage: z.number(),
  date_connected: z.string(),
  meter_code: z.number().nullable(),
  meter_size: z.string().nullable(),
  consumer_type: z.number().nullable(),
  isSenior: z.boolean(),
  zone_code: z.string().nullable(),
  book_code: z.number().nullable(),
  contact_no: z.string().nullable(),
  bill_amount: z.string().nullable(),
  usage: z.string().nullable(),
});

export const SelectConsumerServiceRequest = z.object({
  account_no: z.string(),
  jo_no: z.string(),
  particulars: z.string(),
  prepared_by: z.string(),
  timestamp: z.string(),
  datetime_received: z.string(),
  datetime_start_acc: z.string(),
  datetime_finish_acc: z.string(),
  time_consumed_HOUR: z.number(),
  action_taken: z.string(),
});

export const SelectConsumerServiceRequests = z.array(SelectConsumerServiceRequest);

export const SelectConsumerLedgerEntry = z.object({
  account_no: z.string(),
  billing_month: z.number(),
  billing_year: z.string(),
  usage: z.number(),
  billing_amount: z.string(),
  payment: z.string(),
  total_balance: z.string(),
});

export const SelectConsumerLedger = z.array(SelectConsumerLedgerEntry);

export const AccountParam = z.object({
  accountNo: z.string(),
});

export const AccountYearParam = z.object({
  accountNo: z.string(),
  year: z.string().optional(),
});
