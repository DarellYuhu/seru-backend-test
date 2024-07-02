import prisma from "@database";
import { sign } from "hono/jwt";
import { Prisma } from "@prisma/client";
import { HTTPException } from "hono/http-exception";
import { Config } from "@config";

const signUp = async (payload: Prisma.UserCreateInput) => {
  const hash = await Bun.password.hash(payload.password, {
    algorithm: "bcrypt",
  });
  return prisma.user.create({
    data: { ...payload, password: hash },
    omit: { password: true },
  });
};

const signIn = async (username: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user)
    throw new HTTPException(401, { message: "Wrong username or password" });
  const compare = await Bun.password.verify(password, user.password, "bcrypt");
  if (!compare)
    throw new HTTPException(401, { message: "Wrong username or password" });
  const payload = {
    sub: user.id,
    name: user.name,
    address: user.address,
    email: user.email,
  };
  const token = await sign(payload, Config.JWT_SECRET);
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  };
};

export default { signUp, signIn };
