import { PlumbingFixturesService } from "@srms/server/providers/plumbingFixtures/plumbingFixturesService";
import { AppRouteHandler } from "@srms/server/types";
import {
  AddPlumbingFixtureRoute,
  DeletePlumbingFixtureById,
  GetAllPlumbingFixturesRoute,
  GetPlumbingFixtureById,
  UpdatePlumbingFixtureById,
} from "./plumbingFixtures.routes";

const plumbingFixturesService = new PlumbingFixturesService();

export const addPlumbingFixture: AppRouteHandler<AddPlumbingFixtureRoute> = async (c) => {
  const body = c.req.valid("form");

  const plumbingFixture = await plumbingFixturesService.addPlumbingFixture(body);
  return c.json(plumbingFixture, 200);
};

export const getAllPlumbingFixtures: AppRouteHandler<GetAllPlumbingFixturesRoute> = async (c) => {
  const plumbingFixture = await plumbingFixturesService.getAllPlumbingFixtures();
  return c.json(plumbingFixture, 200);
};

export const getPlumbingFixtureById: AppRouteHandler<GetPlumbingFixtureById> = async (c) => {
  const id = c.req.param("id");
  const plumbingFixture = await plumbingFixturesService.getPlumbingFixtureById(id);
  return c.json(plumbingFixture, 200);
};

export const updatePlumbingFixtureById: AppRouteHandler<UpdatePlumbingFixtureById> = async (c) => {
  const id = c.req.param("id");
  const body = c.req.valid("form");
  const plumbingFixture = await plumbingFixturesService.updatePlumbingFixtureById(id, body);
  return c.json(plumbingFixture, 200);
};

export const deletePlumbingFixtureById: AppRouteHandler<DeletePlumbingFixtureById> = async (c) => {
  const id = c.req.param("id");
  const plumbingFixture = await plumbingFixturesService.deletePlumbingFixtureById(id);
  return c.json(plumbingFixture, 200);
};
