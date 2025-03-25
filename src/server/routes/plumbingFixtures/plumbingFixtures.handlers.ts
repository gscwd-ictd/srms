import { nsaManager } from "@srms/server/app";
import {
  AddPlumbingFixtureRoute,
  DeletePlumbingFixtureById,
  GetAllPlumbingFixturesRoute,
  GetPlumbingFixtureById,
  UpdatePlumbingFixtureById,
} from "./plumbingFixtures.routes";
import { AppRouteHandler } from "@srms/server/types/appTypes";

export const addPlumbingFixture: AppRouteHandler<AddPlumbingFixtureRoute> = async (c) => {
  const body = c.req.valid("form");

  const plumbingFixture = await nsaManager.getPlumbingFixtureService().addPlumbingFixture(body);
  return c.json(plumbingFixture, 200);
};

export const getAllPlumbingFixtures: AppRouteHandler<GetAllPlumbingFixturesRoute> = async (c) => {
  const plumbingFixture = await nsaManager.getPlumbingFixtureService().getAllPlumbingFixtures();
  return c.json(plumbingFixture, 200);
};

export const getPlumbingFixtureById: AppRouteHandler<GetPlumbingFixtureById> = async (c) => {
  const id = c.req.param("id");
  const plumbingFixture = await nsaManager.getPlumbingFixtureService().getPlumbingFixtureById(id);
  return c.json(plumbingFixture, 200);
};

export const updatePlumbingFixtureById: AppRouteHandler<UpdatePlumbingFixtureById> = async (c) => {
  const id = c.req.param("id");
  const body = c.req.valid("form");
  const plumbingFixture = await nsaManager.getPlumbingFixtureService().updatePlumbingFixtureById(id, body);
  return c.json(plumbingFixture, 200);
};

export const deletePlumbingFixtureById: AppRouteHandler<DeletePlumbingFixtureById> = async (c) => {
  const id = c.req.param("id");
  const plumbingFixture = await nsaManager.getPlumbingFixtureService().deletePlumbingFixtureById(id);
  return c.json(plumbingFixture, 200);
};
