import { generateCuid } from "@srms/server/helpers";
import { relations } from "drizzle-orm";
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { puroks } from "./puroks";

export const barangays = pgTable("barangay", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => generateCuid()),
  name: varchar({ length: 200 }).unique().notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const barangayRelations = relations(barangays, ({ many }) => ({
  puroks: many(puroks),
}));
