import { jsonb, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { generateCuid } from "@srms/server/helpers/generateCuid";
import { applicants } from "@srms/server/db/schemas/applicants";
import { DocumentType } from "@srms/utils/constants";

export const documentTypeEnum = pgEnum("document_type", DocumentType);

export const applicantDocuments = pgTable("applicant_documents", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => generateCuid())
    .notNull(),
  applicantId: varchar("applicant_id_fk")
    .references(() => applicants.id, { onDelete: "cascade" })
    .notNull(),
  type: documentTypeEnum("type").notNull(),
  pathNames: jsonb("document_paths").$type<Array<string>>().notNull(),
  test: varchar("test-column"),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
