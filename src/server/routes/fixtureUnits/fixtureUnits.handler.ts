import { AppRouteHandler } from "@srms/server/types/appTypes";
import { AddFixtureUnitRoute, GetFixtureUnitsByYearRoute } from "./fixtureUnits.routes";
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
