import { pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { generateCuid } from "@srms/server/helpers/generateCuid";
import { ApplicationStatus, ApplicationType } from "@srms/utils/constants";

export const applicationTypeEnum = pgEnum("application_type_num", ApplicationType);

export const applicationStatusEnum = pgEnum("application_status_enum", ApplicationStatus);

export const applications = pgTable("applications", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => generateCuid())
    .notNull(),
  type: applicationTypeEnum("type"),
  landmark: text("landmark").notNull(),
  nearestNeighbor: text("nearest_neighbor"),
  remarks: text("remarks"),
  status: applicationStatusEnum("status").default("pending_payment").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
