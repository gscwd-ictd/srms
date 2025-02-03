import { generateCuid } from "@nsa/server/helpers/generateCuid";
import { pgTable, varchar } from "drizzle-orm/pg-core";

export const applications = pgTable("applications", {
  id: varchar("applicant_id")
    .primaryKey()
    .$defaultFn(() => generateCuid()),
});
