import { Hono } from "hono";
import authService from "./auth.service";
import { zValidator } from "@hono/zod-validator";
import authSchema from "./auth.schema";
import { HTTPException } from "hono/http-exception";
import { Prisma } from "@prisma/client";

const auth = new Hono();

auth.post(
  "/signup",
  zValidator("json", authSchema.signUp, (res, c) => {
    if (!res.success) {
      throw new HTTPException(400, {
        message: "Bad request",
        cause: res.error,
      });
    }
  }),
  async (c) => {
    try {
      const { confirmPassword, ...payload } = c.req.valid("json");
      const data = await authService.signUp(payload);
      return c.json({
        status: "Success",
        message: "Account create successfully",
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new HTTPException(409, {
            message: "Username already exist",
            cause: error,
          });
        }
      }
      throw error;
    }
  }
);

auth.post(
  "/signin",
  zValidator("json", authSchema.signIn, (res, c) => {
    if (!res.success) {
      throw new HTTPException(400, {
        message: "Bad request",
        cause: res.error,
      });
    }
  }),
  async (c) => {
    const { username, password } = c.req.valid("json");
    try {
      const data = await authService.signIn(username, password);
      return c.json<TResponse<typeof data>>({
        status: "Success",
        message: "Loged in successfully",
        data,
      });
    } catch (error) {
      throw error;
    }
  }
);

export default auth;
