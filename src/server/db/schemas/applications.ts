import { pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { generateCuid } from "@srms/server/helpers/generateCuid";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { ApplicationStatus, ApplicationType } from "@srms/utils/constants";
import { CreateApplicantSchema, SelectApplicantSchema } from "./applicants";
import { CreateApplicantAddressSchema } from "./address";
import { CreateApplicantHouseholdSchema } from "./applicantHousehold";
import { z } from "zod";

export const applicationTypeEnum = pgEnum("application_type_num", ApplicationType);
export const applicationStatusEnum = pgEnum("application_status_enum", ApplicationStatus);

export const applications = pgTable("applications", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => generateCuid()),
  type: applicationTypeEnum("type"),
  landmark: text("landmark"),
  nearestNeighbor: text("nearest_neighbor"),
  remarks: text("remarks"),
  status: applicationStatusEnum("status").default("pending_payment").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const SelectApplicationSchema = createSelectSchema(applications).extend({
  applicant: SelectApplicantSchema,
  //address: SelectApplicantAddressSchema,
  //household: SelectApplicantHouseholdSchema,
});

export const CreateApplicationSchema = createInsertSchema(applications)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    applicant: CreateApplicantSchema.omit({ applicationId: true }).superRefine((data, ctx) => {
      if (data.firstName.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 3,
          type: "string",
          inclusive: true,
          path: ["firstName"],
        });
      }

      if (data.lastName.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 3,
          type: "string",
          inclusive: true,
          path: ["lastName"],
        });
      }

      if (data.mobileNo.length < 11) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 11,
          type: "string",
          inclusive: true,
          path: ["mobileNo"],
        });
      }
    }),
    address: CreateApplicantAddressSchema.omit({ applicantId: true }),
    household: CreateApplicantHouseholdSchema.omit({ applicantId: true }),
  })
  .openapi({
    description: "The application details as indicated in the SACO form.",
  });
