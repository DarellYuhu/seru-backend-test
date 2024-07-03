import { z } from "zod";

const create = z.object({
  code: z.string(),
  price: z.number(),
  vehicleYearId: z.string(),
  vehicleModelId: z.string(),
});

const update = z.object({
  code: z.string().optional(),
  price: z.number().optional(),
  vehicleYearId: z.string().optional(),
  vehicleModelId: z.string().optional(),
});

const query = z.object({
  code: z.string().optional(),
  price: z.preprocess((item) => Number(item), z.number()).optional(),
  limit: z.preprocess((item) => Number(item), z.number()).optional(),
  page: z.preprocess((item) => Number(item), z.number()).optional(),
});

export default { create, query, update };
