export const Gender = ["Male", "Female"] as const;

export const ApplicationType = ["New", "Additional", "Transfer"] as const;

export const ApplicationStatus = ["pending_payment", "for_survey", "for_installation"] as const;

export const DocumentType = [
  "proof of lot ownership",
  "proof of billing",
  "barangay certificate",
  "valid id",
  "selfie id",
] as const;

export const FixtureCategory = ["General", "Sinks", "Urinals"] as const;

export const TAGS = {
  PLUMBING_FIXTURES: ["Plumbing Fixtures"],
  APPLICANTS: ["Applicants"],
};
