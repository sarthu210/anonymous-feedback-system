import { z } from "zod";

export const acceptMessageSchema = z.object({
  content: z
    .string()
    .length(10, { message: "Content must be atleast of 10 character" })
    .max(300, { message: "Content must be no longer than 300 characters" }),
});
