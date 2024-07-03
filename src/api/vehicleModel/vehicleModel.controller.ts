import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { Prisma } from "@prisma/client";
import vehicleModelSchema from "./vehicleModel.schema";
import vehicleModelService from "./vehicleModel.service";

const vehicleModel = new Hono();

vehicleModel.post(
  "/",
  zValidator("json", vehicleModelSchema.create, (res, _) => {
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
      const data = await vehicleModelService.create(payload);
      return c.json<TResponse<typeof data>>({
        status: "Success",
        message: "Model create successfuly",
        data,
      });
    } catch (error) {
      throw error;
    }
  }
);

vehicleModel.get(
  "/",
  zValidator("query", vehicleModelSchema.query),
  async (c) => {
    try {
      const { limit, page, ...query } = c.req.valid("query");
      const { data, metadata } = await vehicleModelService.getAll(
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

vehicleModel.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const data = await vehicleModelService.getById(id);
    return c.json<TResponse>({
      status: "Success",
      message: "Data retrieve successfully",
      data,
    });
  } catch (error) {
    throw error;
  }
});

vehicleModel.patch(
  "/:id",
  zValidator("json", vehicleModelSchema.update, (res, _) => {
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
      const data = await vehicleModelService.update(id, payload);
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

vehicleModel.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const data = await vehicleModelService._delete(id);
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

export default vehicleModel;
