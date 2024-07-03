import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { Prisma } from "@prisma/client";
import vehicleYearSchema from "./vehicleYear.schema";
import vehicleYearService from "./vehicleYear.service";

const vehicleYear = new Hono();

vehicleYear.post(
  "/",
  zValidator("json", vehicleYearSchema.create, (res, _) => {
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
      const data = await vehicleYearService.create(payload);
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

vehicleYear.get(
  "/",
  zValidator("query", vehicleYearSchema.query),
  async (c) => {
    try {
      const { limit, page, ...query } = c.req.valid("query");
      const { data, metadata } = await vehicleYearService.getAll(
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

vehicleYear.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const data = await vehicleYearService.getById(id);
    return c.json<TResponse>({
      status: "Success",
      message: "Data retrieve successfully",
      data,
    });
  } catch (error) {
    throw error;
  }
});

vehicleYear.patch(
  "/:id",
  zValidator("json", vehicleYearSchema.update, (res, _) => {
    if (!res.success) {
      throw new HTTPException(400, {
        message: "Bad request",
        cause: res.error,
      });
    }
  }),
  async (c) => {
    try {
      const id = c.req.param("id");
      const payload = c.req.valid("json");
      const data = await vehicleYearService.update(id, payload);
      return c.json<TResponse>({
        status: "Success",
        message: "Data update successfully",
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new HTTPException(404, {
            message: "Record to update doesn't exist",
            cause: error,
          });
        }
      }
      throw error;
    }
  }
);

vehicleYear.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const data = await vehicleYearService._delete(id);
    return c.json<TResponse>({
      status: "Success",
      message: "Data update successfully",
      data,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new HTTPException(404, {
          message: "Record to delete doesn't exist",
          cause: error,
        });
      }
    }
    throw error;
  }
});

export default vehicleYear;
