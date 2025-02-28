import { date, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { generateCuid } from "@srms/server/helpers/generateCuid";
import { applications } from "@srms/server/db/schemas/applications";
import { createSelectSchema } from "drizzle-zod";
import { Gender } from "@srms/utils/constants";

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
