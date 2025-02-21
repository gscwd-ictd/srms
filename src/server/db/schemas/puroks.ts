import { generateCuid } from "@srms/server/helpers";
import { relations } from "drizzle-orm";
import { pgTable, varchar } from "drizzle-orm/pg-core";
import { barangays } from "./barangays";

export const puroks = pgTable("purok", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => generateCuid()),
  name: varchar("name", { length: 200 }).unique().notNull(),
});

export const purokRelations = relations(puroks, ({ one }) => ({
  barangay: one(barangays, {
    fields: [puroks.id],
    references: [barangays.id],
  }),
}));
