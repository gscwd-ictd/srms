import { Gender } from "@nsa/server/constants/gender";
import { generateCuid } from "@nsa/server/helpers/generateCuid";
import { date, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { applications } from "./applications";

export const genderEnum = pgEnum("gender", Gender);

export const applicants = pgTable("applicants", {
  id: varchar("applicant_id")
    .primaryKey()
    .$defaultFn(() => generateCuid()),
  applicationId: varchar("application_id_fk")
    .notNull()
    .references(() => applications.id),
  firstName: varchar("first_name").notNull(),
  middleName: varchar("middle_name"),
  lastName: varchar("last_name").notNull(),
  nameExtension: varchar("name_extension"),
  gender: genderEnum("gender").notNull(),
  birthdate: date("birthdate").notNull(),
  mobileNo: varchar("mobile_no").notNull(),
  email: varchar("email"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
