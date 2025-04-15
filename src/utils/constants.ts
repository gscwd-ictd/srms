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
  APPLICATIONS: ["Applications"],
  APPLICANTS: ["Applicants"],
  FIXTURE_UNITS: ["Fixture Units"],
  GEOSERVER: ["GeoServer"],
  TRACKSOLID: ["Tracksolid"],
};

export const fixtureUnitType = ["private", "public"] as const;

export const JimiMethods = {
  OAUTH: "jimi.oauth.token.get",
  USER: "jimi.user.child.list",
  DEVICE: "jimi.user.device.list",
  LOCATION: "jimi.device.location.get",
};
