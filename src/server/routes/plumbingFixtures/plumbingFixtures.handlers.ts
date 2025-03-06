import { plumbingFixtureManager } from "@srms/server/app";
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

  const plumbingFixture = await plumbingFixtureManager.plumbingFixtureService.addPlumbingFixture(body);
  return c.json(plumbingFixture, 200);
};

export const getAllPlumbingFixtures: AppRouteHandler<GetAllPlumbingFixturesRoute> = async (c) => {
  const plumbingFixture = await plumbingFixtureManager.plumbingFixtureService.getAllPlumbingFixtures();
  return c.json(plumbingFixture, 200);
};

export const getPlumbingFixtureById: AppRouteHandler<GetPlumbingFixtureById> = async (c) => {
  const id = c.req.param("id");
  const plumbingFixture = await plumbingFixtureManager.plumbingFixtureService.getPlumbingFixtureById(id);
  return c.json(plumbingFixture, 200);
};

export const updatePlumbingFixtureById: AppRouteHandler<UpdatePlumbingFixtureById> = async (c) => {
  const id = c.req.param("id");
  const body = c.req.valid("form");
  const plumbingFixture = await plumbingFixtureManager.plumbingFixtureService.updatePlumbingFixtureById(
    id,
    body,
  );
  return c.json(plumbingFixture, 200);
};

export const deletePlumbingFixtureById: AppRouteHandler<DeletePlumbingFixtureById> = async (c) => {
  const id = c.req.param("id");
  const plumbingFixture = await plumbingFixtureManager.plumbingFixtureService.deletePlumbingFixtureById(id);
  return c.json(plumbingFixture, 200);
};
