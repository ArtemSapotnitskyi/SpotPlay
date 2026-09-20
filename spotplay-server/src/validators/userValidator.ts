import { z } from "Zod";

export const registerSchema = z.object({
  username: z.string().min(3, "The name must contain at least 3 characters."),
  email: z.email("Invalid email format"),
  password: z
    .string()
    .min(8, "The password must be at least 8 characters long."),
});
