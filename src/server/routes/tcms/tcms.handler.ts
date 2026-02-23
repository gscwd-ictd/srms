import { AppRouteHandler } from "@srms/server/types";
import {
  GetAllConsumerLedgerRoute,
  GetAllConsumerServiceRequestRoute,
  GetConsumerRoute,
} from "./tcms.routes";
import { tcmsManager } from "@srms/server/app";

export const getConsumer: AppRouteHandler<GetConsumerRoute> = async (c) => {
  const accountNo = c.req.param("accountNo");

  const consumerDetails = await tcmsManager.getConsumerService().getConsumer(accountNo);

  return c.json(consumerDetails, 200);
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
