import { Config } from "@config";
import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";

export default async function authentication(c: Context, next: Next) {
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (!token)
    throw new HTTPException(401, {
      message: "Please login first",
    });
  const user = await verify(token, Config.JWT_SECRET);
  c.set("User", user);
  return next();
}
