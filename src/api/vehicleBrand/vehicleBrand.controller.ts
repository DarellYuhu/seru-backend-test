import { Hono } from "hono";
import vehicleBrandService from "./vehicleBrand.service";
import { zValidator } from "@hono/zod-validator";
import vehicleBrandSchema from "./vehicleBrand.schema";
import { HTTPException } from "hono/http-exception";
import { Prisma } from "@prisma/client";
import { authentication, authorization } from "../../middlewares";

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

vehicleBrand.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const data = await vehicleBrandService.getById(id);
    return c.json<TResponse>({
      status: "Success",
      message: "Data retrieve successfully",
      data,
    });
  } catch (error) {
    throw error;
  }
});

vehicleBrand.patch(
  "/:id",
  authentication,
  authorization,
  zValidator("json", vehicleBrandSchema.update, (res, _) => {
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
      const data = await vehicleBrandService.update(id, payload);
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

vehicleBrand.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const data = await vehicleBrandService._delete(id);
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

export default vehicleBrand;
