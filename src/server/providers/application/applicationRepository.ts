// import type {
//   Application,
//   ApplicationDetails,
//   ApplicationStatus,
//   CreateApplicant,
//   CreateApplication,
//   PaginatedResult,
//   QueryParams,
// } from "@srms/server/types";

// export interface ApplicationRepository {
//   // Create new application
//   createApplication(details: CreateApplication, applicant: CreateApplicant): Promise<ApplicationDetails>;

//   // Get application details by application_id
//   getApplicationDetailsById(id: string): Promise<ApplicationDetails>;

//   // Get all application details
//   getAllApplicationDetails(query?: QueryParams): Promise<PaginatedResult<ApplicationDetails>>;

//   // Update application by status
//   updateApplicationStatus(id: string, status: ApplicationStatus): Promise<Application>;
// }
