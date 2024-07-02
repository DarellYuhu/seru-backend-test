import { z } from "zod";

const signUp = z
  .object({
    username: z.string(),
    password: z.string().min(6),
    confirmPassword: z.string(),
    name: z.string(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    isAdmin: z.boolean().optional(),
  })
  .refine(
    (data) => data.confirmPassword === data.password,
    "Password confirmation doesn't match"
  );

const signIn = z.object({
  username: z.string(),
  password: z.string(),
});

export default { signUp, signIn };
