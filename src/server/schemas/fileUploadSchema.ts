import { z } from "zod";

export const FileUploadSchema = z.object({
  filename: z.string().min(1),
  url: z.string().url(),
});
