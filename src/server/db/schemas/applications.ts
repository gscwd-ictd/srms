import { generateCuid } from "@nsa/server/helpers/generateCuid";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const applications = pgTable("applications", {
  id: varchar("application_id")
    .primaryKey()
    .$defaultFn(() => generateCuid()),
  landmark: text("landmark"),
  nearestNeighbor: text("nearest_neighbor"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
