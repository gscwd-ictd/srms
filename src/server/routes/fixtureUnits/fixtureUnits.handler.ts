import { AppRouteHandler } from "@srms/server/types/appTypes";
import {
  AddFixtureUnitRoute,
  DeleteFixtureUnitByIdRoute,
  GetFixtureUnitByIdRoute,
  GetFixtureUnitsByYearRoute,
  UpdateFixtureUnitRoute,
} from "./fixtureUnits.routes";
import { plumbingFixtureManager } from "@srms/server/app";

export const addFixtureUnit: AppRouteHandler<AddFixtureUnitRoute> = async (c) => {
  const body = c.req.valid("json");
  const fixtureUnit = await plumbingFixtureManager.fixtureUnitService.addFixtureUnit(body);
  return c.json(fixtureUnit, 201);
};

export const getFixtureUnitsByYear: AppRouteHandler<GetFixtureUnitsByYearRoute> = async (c) => {
  const year = c.req.param("year");
  const fixtureUnits = await plumbingFixtureManager.fixtureUnitService.getFixtureUnitsByYear(parseInt(year));
  return c.json(fixtureUnits, 200);
};

export const updateFixtureUnit: AppRouteHandler<UpdateFixtureUnitRoute> = async (c) => {
  const body = c.req.valid("json");
  const fixtureUnit = await plumbingFixtureManager.fixtureUnitService.updateFixtureUnit(body);
  return c.json(fixtureUnit, 200);
};

export const getFixtureUnitById: AppRouteHandler<GetFixtureUnitByIdRoute> = async (c) => {
  const id = c.req.param("id");
  const fixtureUnit = await plumbingFixtureManager.fixtureUnitService.getFixtureUnitById(id);
  return c.json(fixtureUnit, 200);
};

export const deleteFixtureUnitById: AppRouteHandler<DeleteFixtureUnitByIdRoute> = async (c) => {
  const id = c.req.param("id");
  const fixtureUnit = await plumbingFixtureManager.fixtureUnitService.deleteFixtureUnitById(id);
  return c.json(fixtureUnit, 200);
};
