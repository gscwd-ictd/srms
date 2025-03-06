import { generateCuid } from "@srms/server/helpers/generateCuid";
import { FixtureCategory } from "@srms/utils/constants";
import { pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const fixtureCategoryEnum = pgEnum("fixture_category_enum", FixtureCategory);

export const plumbingFixtures = pgTable("plumbing_fixtures", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => generateCuid()),
  name: text("name").unique().notNull(),
  description: text("description").notNull(),
  category: fixtureCategoryEnum("category").notNull(),
  file: text("image_url").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const SelectPlumbingFixtureSchema = createSelectSchema(plumbingFixtures);

export const CreatePlumbingFixtureSchema = createInsertSchema(plumbingFixtures)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    file: z.instanceof(File),
  });
