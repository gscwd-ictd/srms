import { jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { generateCuid } from "@srms/server/helpers/generateCuid";
import { multiPolygon } from "@srms/server/helpers/geo";
import { FeatureStyles } from "@srms/server/types/helperTypes";
import { featureStylesDefault } from "@srms/server/constants";

export const serviceableAreas = pgTable("serviceable_areas", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => generateCuid()),
  barangay: text("barangay").unique().notNull(),
  boundaries: multiPolygon("boundaries").notNull(),
  details: text("details"),
  featureStyles: jsonb("feature_styles").$type<FeatureStyles>().default(featureStylesDefault).notNull(),
  /**
   * Add more details...
   */
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
