import { Hono } from "hono";
import vehicleBrandService from "./vehicleBrand.service";
import { zValidator } from "@hono/zod-validator";
import vehicleBrandSchema from "./vehicleBrand.schema";
import { HTTPException } from "hono/http-exception";

const vehicleBrand = new Hono();

vehicleBrand.post(
  "/",
  zValidator("json", vehicleBrandSchema.create, (res, _) => {
    if (!res.success) {
      throw new HTTPException(400, {
        message: "Bad request",
        cause: res.error,
      });
    }
  }),
  async (c) => {
    try {
      const payload = c.req.valid("json");
      const data = await vehicleBrandService.create(payload);
      return c.json<TResponse<typeof data>>({
        status: "Success",
        message: "Brand create successfuly",
        data,
      });
    } catch (error) {
      throw error;
    }
  }
);

vehicleBrand.get(
  "/",
  zValidator("query", vehicleBrandSchema.query),
  async (c) => {
    try {
      const { limit, page, ...query } = c.req.valid("query");
      const { data, metadata } = await vehicleBrandService.getAll(
        limit,
        page,
        query
      );
      return c.json<TResponse>({
        status: "Success",
        message: "Data retrieve successfully",
        data,
        metadata,
      });
    } catch (error) {
      throw error;
    }
  }
);

export default vehicleBrand;
