import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { generateCuid } from '@srms/server/helpers/generateCuid';
import { applicants } from '@srms/server/db/schemas/applicants';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const applicantHousehold = pgTable('applicant_household', {
  id: varchar('id')
    .primaryKey()
    .$defaultFn(() => generateCuid()),
  applicantId: varchar('applicant_id_fk')
    .notNull()
    .references(() => applicants.id),
  noOfPersonsInHousehold: integer('no_of_persons_in_household').default(0).notNull(),
  noOfHousesInLot: integer('no_of_houses_in_lot').default(0).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const SelectApplicantHouseholdSchema = createSelectSchema(applicantHousehold);

export const CreateApplicantHouseholdSchema = createInsertSchema(applicantHousehold).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
