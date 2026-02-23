// import { defineRelations  } from "drizzle-orm";
// import { plumbingFixtures, fixturesUnit, applicants, applicantPlumbingFixtures, applications, applicantAddress, applicantDocuments, applicantHousehold } from "./schema";

// export const fixturesUnitRelations = defineRelations (fixturesUnit, ({one}) => ({
// 	plumbingFixture: one(plumbingFixtures, {
// 		fields: [fixturesUnit.plumbingFixturesIdFk],
// 		references: [plumbingFixtures.id]
// 	}),
// }));

// export const plumbingFixturesRelations = defineRelations (plumbingFixtures, ({many}) => ({
// 	fixturesUnits: many(fixturesUnit),
// 	applicantPlumbingFixtures: many(applicantPlumbingFixtures),
// }));

// export const applicantPlumbingFixturesRelations = defineRelations (applicantPlumbingFixtures, ({one}) => ({
// 	applicant: one(applicants, {
// 		fields: [applicantPlumbingFixtures.applicantIdFk],
// 		references: [applicants.id]
// 	}),
// 	plumbingFixture: one(plumbingFixtures, {
// 		fields: [applicantPlumbingFixtures.plumbingFixtureIdFk],
// 		references: [plumbingFixtures.id]
// 	}),
// }));

// export const applicantsRelations = defineRelations (applicants, ({one, many}) => ({
// 	applicantPlumbingFixtures: many(applicantPlumbingFixtures),
// 	application: one(applications, {
// 		fields: [applicants.applicationIdFk],
// 		references: [applications.id]
// 	}),
// 	applicantAddresses: many(applicantAddress),
// 	applicantDocuments: many(applicantDocuments),
// 	applicantHouseholds: many(applicantHousehold),
// }));

// export const applicationsRelations = defineRelations (applications, ({many}) => ({
// 	applicants: many(applicants),
// }));

// export const applicantAddressRelations = defineRelations (applicantAddress, ({one}) => ({
// 	applicant: one(applicants, {
// 		fields: [applicantAddress.applicantIdFk],
// 		references: [applicants.id]
// 	}),
// }));

// export const applicantDocumentsRelations = defineRelations (applicantDocuments, ({one}) => ({
// 	applicant: one(applicants, {
// 		fields: [applicantDocuments.applicantIdFk],
// 		references: [applicants.id]
// 	}),
// }));

// export const applicantHouseholdRelations = defineRelations (applicantHousehold, ({one}) => ({
// 	applicant: one(applicants, {
// 		fields: [applicantHousehold.applicantIdFk],
// 		references: [applicants.id]
// 	}),
// }));
