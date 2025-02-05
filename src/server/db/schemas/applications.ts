import { ApplicationType } from "@nsa/server/constants/applicationType";
import { generateCuid } from "@nsa/server/helpers/generateCuid";
import { pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const applicationTypeEnum = pgEnum("application_type_num", ApplicationType);

export const applications = pgTable("applications", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => generateCuid()),
  type: applicationTypeEnum("type"),
  landmark: text("landmark"),
  nearestNeighbor: text("nearest_neighbor"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
