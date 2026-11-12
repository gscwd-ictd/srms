import { AppRouteHandler } from "@srms/server/types";
import {
  GetAllConsumerLedgerRoute,
  GetAllConsumerServiceRequestRoute,
  GetConsumerLedgerLastEntryRoute,
  GetConsumerRoute,
  GetConsumersRoute,
} from "./tcms.routes";
import { tcmsManager } from "@srms/server/app";
import { z } from "zod";
import { SelectConsumers } from "@srms/lib/tcms/schemas";

type ConsumersSchema = z.infer<typeof SelectConsumers>;

export const getConsumer: AppRouteHandler<GetConsumerRoute> = async (c) => {
  const accountNo = c.req.param("accountNo");

  const consumerDetails = await tcmsManager.getConsumerService().getConsumer(accountNo);

  return c.json(consumerDetails, 200);
};

export const getConsumers: AppRouteHandler<GetConsumersRoute> = async (c) => {
  const pageIndex = c.req.param("pageIndex");
  const pageSize = c.req.param("pageSize");
  const body = c.req.valid("json");

  const consumers = (await tcmsManager
    .getConsumerService()
    .getConsumers(pageIndex, pageSize, body)) as ConsumersSchema;

  return c.json(consumers, 200);
};

export const getConsumersByAccountNo: AppRouteHandler<GetConsumersRoute> = async (c) => {
  const pageIndex = c.req.param("pageIndex");
  const pageSize = c.req.param("pageSize");
  const body = c.req.valid("json");

  const consumers = (await tcmsManager
    .getConsumerService()
    .getConsumersByAccountNo(pageIndex, pageSize, body)) as ConsumersSchema;

  return c.json(consumers, 200);
};

export const getAllConsumerServiceRequest: AppRouteHandler<GetAllConsumerServiceRequestRoute> = async (c) => {
  const { accountNo, year } = c.req.valid("query");

  const consumerServiceRequest = await tcmsManager
    .getConsumerService()
    .getAllConsumerService(accountNo, year);

  return c.json(consumerServiceRequest, 200);
};

export const getAllConsumerLedger: AppRouteHandler<GetAllConsumerLedgerRoute> = async (c) => {
  const { accountNo, year } = c.req.valid("query");

  const consumerLedger = await tcmsManager.getConsumerService().getAllConsumerLedger(accountNo, year);

  return c.json(consumerLedger, 200);
};

export const getConsumerLedgerLastEntry: AppRouteHandler<GetConsumerLedgerLastEntryRoute> = async (c) => {
  const { accountNo, year } = c.req.valid("query");

  const consumerLedgerLastEntry = await tcmsManager
    .getConsumerService()
    .getConsumerLedgerLastEntry(accountNo, year);

  return c.json(consumerLedgerLastEntry, 200);
};
