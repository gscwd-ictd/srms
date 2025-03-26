import { jsonb, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { generateCuid } from "@srms/server/helpers/generateCuid";
import { DocumentType } from "@srms/utils/constants";
import { applications } from "@srms/server/db/schemas/applications";

export const documentTypeEnum = pgEnum("document_type", DocumentType);

export const applicantDocuments = pgTable("applicant_documents", {
  id: varchar("applicant_document_id")
    .primaryKey()
    .$defaultFn(() => generateCuid())
    .notNull(),
  applicationId: varchar("application_id_fk")
    .references(() => applications.id, { onDelete: "cascade" })
    .notNull(),
  type: documentTypeEnum("type").notNull(),
  files: jsonb("document_paths").$type<string[]>().notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
