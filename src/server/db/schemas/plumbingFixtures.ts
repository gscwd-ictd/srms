import { FixtureCategory } from "@srms/server/constants/fixtureCategory";
import { generateCuid } from "@srms/server/helpers";
import { pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const fixtureCategoryEnum = pgEnum("fixture_category_enum", FixtureCategory);

export const plumbingFixtures = pgTable("plumbing_fixtures", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => generateCuid()),
  name: text().unique().notNull(),
  description: text().notNull(),
  category: fixtureCategoryEnum().notNull(),
  imageUrl: text().notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
