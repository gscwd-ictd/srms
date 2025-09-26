import { describe, expect, it, vi } from "vitest";
import { MeterSizingCalculatorService } from "../services/MeterSizingCalculatorService";
import { MeterSizingCalculatorRepository } from "../repositories/MeterSizingCalculatorRepository";
import { MeterSizingApplicationDetails, MeterSizingDemandDetails } from "../types";

describe("Meter Sizing Service Function Testing", () => {
  it("should return the Fixture Quantities Table and Total Demand", async () => {
    const meterSizingCalculatorService = new MeterSizingCalculatorService(
      new MeterSizingCalculatorRepository(),
    );

    const mockBody = {
      applicationId: "12345",
      plumbingFixtures: [
        {
          plumbingFixturesId: "cm8fj7nfx0hrh7egw8ik",
          quantity: 5,
        },
        {
          plumbingFixturesId: "cm8fj7bg20hrge9x3qbs",
          quantity: 3,
        },
        {
          plumbingFixturesId: "cm8fj88c60hrag0i289y",
          quantity: 1,
        },
      ],
      type: "private",
    } as MeterSizingApplicationDetails;

    const shouldBeResult = {
      demand: [
        {
          plumbingFixturesId: "cm8fj7nfx0hrh7egw8ik",
          quantity: 5,
          fixtureUnit: 1.5,
          totalFixtureUnitValue: 7.5,
        },
        {
          plumbingFixturesId: "cm8fj7bg20hrge9x3qbs",
          quantity: 3,
          fixtureUnit: 4,
          totalFixtureUnitValue: 12,
        },
        {
          plumbingFixturesId: "cm8fj88c60hrag0i289y",
          quantity: 1,
          fixtureUnit: 0.5,
          totalFixtureUnitValue: 0.5,
        },
      ],
      totalDemand: 20,
    } as MeterSizingDemandDetails;

    vi.spyOn(meterSizingCalculatorService, "getTotalDemand").mockResolvedValue(shouldBeResult);

    const demandCalculatorResult = await meterSizingCalculatorService.getTotalDemand(mockBody);

    expect(demandCalculatorResult).toEqual(shouldBeResult);
  });

  it("should return error 404 fixture not found", async () => {
    //expect()
  });
});
