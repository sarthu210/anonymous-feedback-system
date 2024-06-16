import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, "Username must be contain atlast 2 characters!")
  .max(20, "Username must be not contain more than 20 characters!")
  .regex(/^[a-zA-Z0-9_]+$/, "User name dose not contain any special chracter");

export const signUpSchema = z.object({
  username: userNameValidation,
  email: z.string().email({ message: "Invalid Email Address" }),
  password: z
    .string()
    .min(6, { message: "Password Must be contain at least 6 character" }),
});
