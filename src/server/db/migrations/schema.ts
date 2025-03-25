import {
  pgTable,
  foreignKey,
  varchar,
  numeric,
  integer,
  timestamp,
  unique,
  text,
  date,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const applicationStatusEnum = pgEnum("application_status_enum", [
  "pending_payment",
  "for_survey",
  "for_installation",
]);
export const applicationTypeNum = pgEnum("application_type_num", ["New", "Additional", "Transfer"]);
export const documentType = pgEnum("document_type", [
  "proof of lot ownership",
  "proof of billing",
  "barangay certificate",
  "valid id",
  "selfie id",
]);
export const fixtureCategoryEnum = pgEnum("fixture_category_enum", ["General", "Sinks", "Urinals"]);
export const fixtureUnitTypeEnum = pgEnum("fixture_unit_type_enum", ["private", "public"]);
export const gender = pgEnum("gender", ["Male", "Female"]);

export const fixturesUnit = pgTable(
  "fixtures_unit",
  {
    id: varchar().primaryKey().notNull(),
    plumbingFixturesIdFk: varchar("plumbing_fixtures_id_fk").notNull(),
    type: fixtureUnitTypeEnum(),
    value: numeric({ precision: 6, scale: 3 }),
    year: integer(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.plumbingFixturesIdFk],
      foreignColumns: [plumbingFixtures.id],
      name: "fixtures_unit_plumbing_fixtures_id_fk_plumbing_fixtures_id_fk",
    }),
  ],
);

export const plumbingFixtures = pgTable(
  "plumbing_fixtures",
  {
    id: varchar().primaryKey().notNull(),
    name: text().notNull(),
    description: text().notNull(),
    category: fixtureCategoryEnum().notNull(),
    filePath: text("file_path").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow(),
  },
  (table) => [unique("plumbing_fixtures_name_unique").on(table.name)],
);

export const applicantPlumbingFixtures = pgTable(
  "applicant_plumbing_fixtures",
  {
    id: varchar().primaryKey().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow(),
    applicantIdFk: varchar("applicant_id_fk").notNull(),
    plumbingFixtureIdFk: varchar("plumbing_fixture_id_fk").notNull(),
    quantity: integer().default(0).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.applicantIdFk],
      foreignColumns: [applicants.id],
      name: "applicant_plumbing_fixtures_applicant_id_fk_applicants_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.plumbingFixtureIdFk],
      foreignColumns: [plumbingFixtures.id],
      name: "applicant_plumbing_fixtures_plumbing_fixture_id_fk_plumbing_fix",
    }).onDelete("cascade"),
    unique("applicant_plumbing_fixtures_applicant_id_fk_plumbing_fixture_id").on(
      table.applicantIdFk,
      table.plumbingFixtureIdFk,
    ),
  ],
);

export const applicants = pgTable(
  "applicants",
  {
    id: varchar().primaryKey().notNull(),
    applicationIdFk: varchar("application_id_fk").notNull(),
    firstName: varchar("first_name").notNull(),
    middleName: varchar("middle_name"),
    lastName: varchar("last_name").notNull(),
    nameExtension: varchar("name_extension"),
    spouse: varchar(),
    gender: gender().notNull(),
    birthdate: date().notNull(),
    mobileNumber: varchar("mobile_number").notNull(),
    email: varchar(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.applicationIdFk],
      foreignColumns: [applications.id],
      name: "applicants_application_id_fk_applications_id_fk",
    }).onDelete("cascade"),
  ],
);

export const applicantAddress = pgTable(
  "applicant_address",
  {
    id: varchar().primaryKey().notNull(),
    applicantIdFk: varchar("applicant_id_fk").notNull(),
    lotNumber: varchar("lot_number"),
    blockNumber: varchar("block_number"),
    street: varchar(),
    purokVillageSubdivision: varchar("purok_village_subdivision"),
    barangay: text(),
    city: varchar().default("General Santos City").notNull(),
    province: varchar().default("South Cotabato").notNull(),
    zipCode: varchar("zip_code", { length: 4 }).default("9500").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.applicantIdFk],
      foreignColumns: [applicants.id],
      name: "applicant_address_applicant_id_fk_applicants_id_fk",
    }).onDelete("cascade"),
  ],
);

export const applicantDocuments = pgTable(
  "applicant_documents",
  {
    id: varchar().primaryKey().notNull(),
    applicantIdFk: varchar("applicant_id_fk").notNull(),
    type: documentType().notNull(),
    documentPaths: jsonb("document_paths").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.applicantIdFk],
      foreignColumns: [applicants.id],
      name: "applicant_documents_applicant_id_fk_applicants_id_fk",
    }).onDelete("cascade"),
  ],
);

export const applicantHousehold = pgTable(
  "applicant_household",
  {
    id: varchar().primaryKey().notNull(),
    applicantIdFk: varchar("applicant_id_fk").notNull(),
    numberOfPersons: integer("number_of_persons").default(0).notNull(),
    numberOfHouses: integer("number_of_houses").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.applicantIdFk],
      foreignColumns: [applicants.id],
      name: "applicant_household_applicant_id_fk_applicants_id_fk",
    }).onDelete("cascade"),
  ],
);

export const applications = pgTable("applications", {
  id: varchar().primaryKey().notNull(),
  type: applicationTypeNum(),
  landmark: text().notNull(),
  nearestNeighbor: text("nearest_neighbor"),
  remarks: text(),
  status: applicationStatusEnum().default("pending_payment").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow(),
});
