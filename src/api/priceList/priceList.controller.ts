import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { Prisma } from "@prisma/client";
import priceListSchema from "./priceList.schema";
import priceListService from "./priceList.service";

const priceList = new Hono();

priceList.post(
  "/",
  zValidator("json", priceListSchema.create, (res, _) => {
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
      const data = await priceListService.create(payload);
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

priceList.get("/", zValidator("query", priceListSchema.query), async (c) => {
  try {
    const { limit, page, ...query } = c.req.valid("query");
    const { data, metadata } = await priceListService.getAll(
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
});

priceList.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const data = await priceListService.getById(id);
    return c.json<TResponse>({
      status: "Success",
      message: "Data retrieve successfully",
      data,
    });
  } catch (error) {
    throw error;
  }
});

priceList.patch(
  "/:id",
  zValidator("json", priceListSchema.update, (res, _) => {
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
      const data = await priceListService.update(id, payload);
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

priceList.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const data = await priceListService._delete(id);
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

export default priceList;
