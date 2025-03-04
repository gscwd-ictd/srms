import { z, ZodError } from "zod";
import { ErrorResponseSchema } from "../schemas/helperSchemas";

export function formatZodError(error: ZodError): z.infer<typeof ErrorResponseSchema> {
  const fieldErrors = error.issues.reduce(
    (acc, issue) => {
      const fieldName = issue.path[issue.path.length - 1]?.toString() ?? "unknown";

      let errorMessage = "";
      switch (issue.code) {
        case "invalid_type":
          if (issue.received === "undefined") {
            errorMessage = `${formatFieldName(fieldName)} is required`;
          } else {
            errorMessage = `${formatFieldName(fieldName)} must be a ${issue.expected}`;
          }
          break;
        case "too_small":
          errorMessage = `${formatFieldName(fieldName)} must be at least ${issue.minimum} characters`;
          break;
        case "too_big":
          errorMessage = `${formatFieldName(fieldName)} must be at most ${issue.maximum} characters`;
          break;
        case "invalid_string":
          if (issue.validation === "email") {
            errorMessage = "Please enter a valid email address";
          } else if (issue.validation === "url") {
            errorMessage = "Please enter a valid URL";
          } else {
            errorMessage = `Invalid ${formatFieldName(fieldName)}`;
          }
          break;
        default:
          errorMessage = issue.message || `Invalid ${formatFieldName(fieldName)}`;
      }

      acc[fieldName] = errorMessage;
      return acc;
    },
    {} as Record<string, string>,
  );

  const fieldCount = Object.keys(fieldErrors).length;
  const summaryMessage =
    fieldCount === 1 ? `Please fix the following error:` : `Please fix the following ${fieldCount} errors:`;

  return {
    status: 422,
    name: "EntityValidationError",
    message: summaryMessage,
    fields: fieldErrors,
  };
}

function formatFieldName(field: string): string {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}
