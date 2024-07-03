import { z } from "zod";

const create = z.object({
  name: z.string(),
  description: z.string(),
  isOnroad: z.boolean(),
  vehicleBrandId: z.string(),
});

const update = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  isOnroad: z.boolean().optional(),
  vehicleBrandId: z.string().optional(),
});

const query = z.object({
  name: z.string().optional(),
  isOnroad: z.boolean().optional(),
  limit: z.preprocess((item) => Number(item), z.number()).optional(),
  page: z.preprocess((item) => Number(item), z.number()).optional(),
});

export default { create, query, update };
