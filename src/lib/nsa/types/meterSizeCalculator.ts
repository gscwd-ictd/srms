export type MeterSizingDemandDetails = {
  demand: {
    plumbingFixturesId: string;
    quantity: number;
    fixtureUnit: number;
    totalFixtureUnitValue: number;
  }[];
  totalDemand: number;
};

export type MeterSizingApplicationDetails = {
  applicationId: string;
  type: "private" | "public";
  plumbingFixtures: { plumbingFixturesId: string; quantity: number }[];
};
