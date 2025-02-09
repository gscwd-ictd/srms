import { generateCuid } from "@srms/server/helpers";
import { polygon } from "@srms/server/helpers/postGIS";
import { text, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const serviceableAreas = pgTable("serviceable_areas", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => generateCuid()),
  barangayName: text("barangay_name").notNull(),
  boundaries: polygon("boundaries").notNull(),
  /**
   * Add more details...
   */
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
