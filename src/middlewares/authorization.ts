import prisma from "@database";
import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

export default async function authorization(c: Context, next: Next) {
  const user = c.get("User");
  const _user = await prisma.user.findUnique({ where: { id: user.sub } });
  if (!_user?.isAdmin)
    throw new HTTPException(403, {
      message: "You don't have permission to perform this action",
    });
  return next();
}
