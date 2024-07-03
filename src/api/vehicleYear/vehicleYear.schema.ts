import { z } from "zod";

const create = z.object({
  year: z
    .string()
    .max(4)
    .refine((item) => /^\d+$/.test(item), "Must be a number"),
});

const update = z.object({
  year: z
    .string()
    .max(4)
    .refine((item) => /^\d+$/.test(item), "Must be a number")
    .optional(),
});

const query = z.object({
  year: z.string().optional(),
  limit: z.preprocess((item) => Number(item), z.number()).optional(),
  page: z.preprocess((item) => Number(item), z.number()).optional(),
});

export default { create, query, update };
