import { FeatureStyles } from "@srms/server/types";

export const featureStylesDefault: FeatureStyles = {
  fillColor: "rgb(197, 202, 233, 0.4)",
  strokeColor: "rgb(79, 70, 229, 1.0)",
  strokeWidth: [3],
  outlineStyle: "solid",
  freehand: false,
  enableSnapping: true,
  snapTolerance: [7],
  snapToEdge: true,
  snapToVertex: true,
};

export const Gender = ["Male", "Female"] as const;

export const ApplicationType = ["New", "Additional", "Transfer"] as const;

export const ApplicationStatus = ["pending_payment", "for_survey", "for_installation"] as const;
