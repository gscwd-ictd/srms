import { date, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { generateCuid } from "@srms/server/helpers/generateCuid";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { Gender } from "@srms/utils/constants";
import { applications } from "./applications";

export const genderEnum = pgEnum("gender", Gender);

export const applicants = pgTable("applicants", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => generateCuid()),
  applicationId: varchar("application_id_fk")
    .notNull()
    .references(() => applications.id),
  firstName: varchar("first_name").notNull(),
  middleName: varchar("middle_name"),
  lastName: varchar("last_name").notNull(),
  nameExtension: varchar("name_extension"),
  spouse: varchar("spouse"),
  gender: genderEnum("gender").notNull(),
  birthdate: date("birthdate").notNull(),
  mobileNo: varchar("mobile_no").notNull(),
  email: varchar("email"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const SelectApplicantSchema = createSelectSchema(applicants);

export const CreateApplicantSchema = createInsertSchema(applicants)
  .omit({
    id: true,
    email: true,
    createdAt: true,
    updatedAt: true,
  })
  .openapi({
    description: "The details of an individual or entity requesting for a new water service connection",
  });
