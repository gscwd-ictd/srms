import { AppRouteHandler } from "@srms/server/types/appTypes";
import {
  AddFixtureUnitRoute,
  AddFixtureUnitsByFileRoute,
  DeleteFixtureUnitByIdRoute,
  GetFixtureUnitByIdRoute,
  GetFixtureUnitsByYearRoute,
  UpdateFixtureUnitRoute,
} from "./fixtureUnits.routes";
import { nsaManager } from "@srms/server/app";

export const addFixtureUnit: AppRouteHandler<AddFixtureUnitRoute> = async (c) => {
  const body = c.req.valid("json");
  const fixtureUnit = await nsaManager.getFixtureUnitService().addFixtureUnit(body);
  return c.json(fixtureUnit, 201);
};

export const addFixtureUnitsByFile: AppRouteHandler<AddFixtureUnitsByFileRoute> = async (c) => {
  const body = await c.req.formData();
  const result = await nsaManager.getFixtureUnitService().addFixtureUnitsByFile(body);
  return c.json(result, 201);
};

export const getFixtureUnitsByYear: AppRouteHandler<GetFixtureUnitsByYearRoute> = async (c) => {
  const year = c.req.param("year");
  const fixtureUnits = await nsaManager.getFixtureUnitService().getFixtureUnitsByYear(parseInt(year));
  return c.json(fixtureUnits, 200);
};

export const updateFixtureUnit: AppRouteHandler<UpdateFixtureUnitRoute> = async (c) => {
  const body = c.req.valid("json");
  const fixtureUnit = await nsaManager.getFixtureUnitService().updateFixtureUnit(body);
  return c.json(fixtureUnit, 200);
};

export const getFixtureUnitById: AppRouteHandler<GetFixtureUnitByIdRoute> = async (c) => {
  const id = c.req.param("id");
  const fixtureUnit = await nsaManager.getFixtureUnitService().getFixtureUnitById(id);
  return c.json(fixtureUnit, 200);
};

export const deleteFixtureUnitById: AppRouteHandler<DeleteFixtureUnitByIdRoute> = async (c) => {
  const id = c.req.param("id");
  const fixtureUnit = await nsaManager.getFixtureUnitService().deleteFixtureUnitById(id);
  return c.json(fixtureUnit, 200);
};
