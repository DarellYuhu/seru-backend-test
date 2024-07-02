import { z } from "zod";

const create = z.object({
  name: z.string(),
  country: z.string(),
  logoUri: z.string(),
  websiteUri: z.string(),
  description: z.string(),
});

const query = z.object({
  name: z.string().optional(),
  country: z.string().optional(),
  limit: z.preprocess((item) => Number(item), z.number()).optional(),
  page: z.preprocess((item) => Number(item), z.number()).optional(),
});

export default { create, query };
