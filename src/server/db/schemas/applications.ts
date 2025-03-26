import { pgEnum, pgTable, pgView, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { generateCuid } from "@srms/server/helpers/generateCuid";
import { ApplicationStatus, ApplicationType } from "@srms/utils/constants";
import { applicants } from "./applicants";
import { eq, sql } from "drizzle-orm";
import { applicantAddress } from "./address";
import { applicantHousehold } from "./applicantHousehold";
import { applicantPlumbingFixtures } from "./applicantFixtures";
import { plumbingFixtures } from "./plumbingFixtures";

export const applicationTypeEnum = pgEnum("application_type_num", ApplicationType);

export const applicationStatusEnum = pgEnum("application_status_enum", ApplicationStatus);

export const applications = pgTable("applications", {
  id: varchar("application_id")
    .primaryKey()
    .$defaultFn(() => generateCuid())
    .notNull(),
  type: applicationTypeEnum("type"),
  landmark: text("landmark").notNull(),
  nearestNeighbor: text("nearest_neighbor"),
  remarks: text("remarks"),
  status: applicationStatusEnum("status").default("pending_payment").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const applicationView = pgView("applicantion_view").as((view) =>
  view
    .select({
      id: applications.id,
      type: applications.type,
      landmark: applications.landmark,
      nearestNeighbor: applications.nearestNeighbor,
      remarks: applications.remarks,
      status: applications.status,
      createdAt: applications.createdAt,
      updatedAt: applications.updatedAt,
      applicant: {
        id: applicants.id,
        firstName: applicants.firstName,
        middleName: applicants.middleName,
        lastName: applicants.lastName,
        nameExtension: applicants.nameExtension,
        spouse: applicants.spouse,
        gender: applicants.gender,
        birthdate: applicants.birthdate,
        mobileNo: applicants.mobileNo,
        email: applicants.email,
      },
      address: {
        id: applicantAddress.id,
        lotNo: applicantAddress.lotNo,
        blockNo: applicantAddress.blockNo,
        street: applicantAddress.street,
        prkVillSubd: applicantAddress.prkVillSubd,
        barangayId: applicantAddress.barangayId,
        city: applicantAddress.city,
        province: applicantAddress.province,
        zipCode: applicantAddress.zipCode,
      },
      household: {
        id: applicantHousehold.id,
        noOfPersonsInHousehold: applicantHousehold.noOfPersonsInHousehold,
        noOfHousesInLot: applicantHousehold.noOfHousesInLot,
      },
      fixtures: sql`
          coalesce(
            (
              select jsonb_agg(
                jsonb_build_object(
                  'id', ${applicantPlumbingFixtures.id},
                  'fixtureId', ${applicantPlumbingFixtures.fixtureId},
                  'name', ${plumbingFixtures.name},
                  'quantity', ${applicantPlumbingFixtures.quantity}
                )
              ) 
              from ${applicantPlumbingFixtures}
              left join ${plumbingFixtures} on ${plumbingFixtures.id} = ${applicantPlumbingFixtures.fixtureId}  
              where ${applicantPlumbingFixtures.applicationId} = ${applications.id}
            ), 
            '[]'::jsonb
          )`.as("fixtures"),
    })
    .from(applications)
    .innerJoin(applicants, eq(applications.id, applicants.applicationId))
    .innerJoin(applicantAddress, eq(applicantAddress.applicantId, applicants.id))
    .innerJoin(applicantHousehold, eq(applicantHousehold.applicantId, applicants.id)),
);
