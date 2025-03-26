import { generateCuid } from "@srms/server/helpers/generateCuid";
import { FixtureCategory } from "@srms/utils/constants";
import { pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const fixtureCategoryEnum = pgEnum("fixture_category_enum", FixtureCategory);

export const plumbingFixtures = pgTable("plumbing_fixtures", {
  id: varchar("plumbing_fixture_id")
    .primaryKey()
    .$defaultFn(() => generateCuid())
    .notNull(),
  name: text("name").unique().notNull(),
  description: text("description").notNull(),
  category: fixtureCategoryEnum("category").notNull(),
  file: text("file_path").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
