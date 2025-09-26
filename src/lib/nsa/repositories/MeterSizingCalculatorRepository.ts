import { I_MeterSizingCalculatorRepository } from "../interfaces/MeterSizingCalculatorInterface/IMeterSizingCalculatorRepository";
import { MeterSizingApplicationDetails, MeterSizingDemandDetails } from "../types";

const fixturesUnitTable = [
  {
    plumbingFixturesId: "cm8fj6kcx0href08b9yy",
    name: "Bathtub",
    privateValue: 4.0,
    publicValue: 4.0,
    year: 2021,
  },
  {
    plumbingFixturesId: "cm8fj6ydv0hrjl0mbx38",
    name: "Bidet",
    privateValue: 1.0,
    publicValue: 0.0,
    year: 2021,
  },
  {
    plumbingFixturesId: "cm8fj7bg20hrge9x3qbs",
    name: "Clothes Washer",
    privateValue: 4.0,
    publicValue: 4.0,
    year: 2021,
  },
  {
    plumbingFixturesId: "cm8fj7nfx0hrh7egw8ik",
    name: "Dishwasher, Domestic",
    privateValue: 1.5,
    publicValue: 1.5,
    year: 2021,
  },
  {
    plumbingFixturesId: "cm8fj7y090hrinl30t1u",
    name: "Dental unit or Cuspidor",
    privateValue: 0.0,
    publicValue: 1.0,
    year: 2021,
  },
  {
    plumbingFixturesId: "cm8fj88c60hrag0i289y",
    name: "Drinking Fountain or Water Cooler",
    privateValue: 0.5,
    public: 0.5,
    year: 2021,
  },
  {
    plumbingFixturesId: "cm8fj8mfl0hrb1p8ym5p",
    name: "Lavatory",
    privateValue: 1.0,
    publicValue: 1.0,
    year: 2021,
  },
  {
    plumbingFixturesId: "cm8fj8zkw0hrpx7l6s20",
    name: "Hose Bibb",
    privateValue: 2.5,
    publicValue: 2.5,
    year: 2021,
  },
  {
    plumbingFixturesId: "cm8fj9bdg0hrpuyjhi39",
    name: "Lawn Sprinkler",
    privateValue: 1.0,
    publicValue: 1.0,
    year: 2021,
  },
  {
    plumbingFixturesId: "cm8fj9tbr0hr6xkc16mm",
    name: "Sink",
    privateValue: 1.0,
    publicValue: 2.0,
    year: 2021,
  },
  {
    plumbingFixturesId: "cm8fja7qc0hrsrf7m9ri",
    name: "Shower Head",
    privateValue: 0.0,
    publicValue: 0.0,
    year: 2021,
  },
  {
    plumbingFixturesId: "cm8fjb49y0hrrjpbspjk",
    name: "Flushometer",
    privateValue: 3.0,
    publicValue: 4.0,
    year: 2021,
  },
  {
    plumbingFixturesId: "cm8fjbetr0hrjhukzph3",
    name: "Water Closet",
    privateValue: 2.5,
    publicValue: 2.5,
    year: 2021,
  },
];

export class MeterSizingCalculatorRepository implements I_MeterSizingCalculatorRepository {
  async getTotalDemand(applicationDetails: MeterSizingApplicationDetails): Promise<MeterSizingDemandDetails> {
    const { plumbingFixtures, type } = applicationDetails;

    let totalDemand = 0;
    const demand = await Promise.all(
      plumbingFixtures.map(async (plumbingFixture) => {
        const item = fixturesUnitTable.find(
          (fixtureUnit) => fixtureUnit.plumbingFixturesId === plumbingFixture.plumbingFixturesId,
        );
        const { plumbingFixturesId, quantity } = plumbingFixture;
        const { privateValue, publicValue } = item!;
        const fixtureUnitTypeValue = type === "private" ? privateValue : publicValue;
        const totalFixtureUnitValue = fixtureUnitTypeValue! * quantity;
        totalDemand += totalFixtureUnitValue;
        return {
          plumbingFixturesId,
          quantity,
          fixtureUnit: privateValue,
          totalFixtureUnitValue,
        };
      }),
    );

    return Promise.resolve({
      demand,
      totalDemand,
    });
  }
}
