import app from "@app";
import { describe, expect, beforeAll, afterAll, it, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { Prisma, User } from "@prisma/client";
import { clearDatabase, generateCases, seedDatabase } from "./helpers";
import { ZodError } from "zod";

let username: string;
let password: string;

beforeAll(async () => {
  try {
    const { user } = await seedDatabase();
    username = user.username;
    password = user.password;
  } catch (error) {
    console.log("ERR_CLEANUP", error);
  }
});

afterAll(async () => {
  try {
    await clearDatabase();
  } catch (error) {
    console.log("ERR_CLEANUP", error);
  }
});

describe("Create new account", () => {
  const password = faker.internet.password();
  const payload = {
    username: faker.internet.userName(),
    password: password,
    confirmPassword: password,
    name: faker.internet.displayName(),
    email: faker.internet.email(),
    address: faker.location.streetAddress({ useFullAddress: true }),
  };

  const cases = [
    { label: "no username", exclude: [0] },
    { label: "no password", exclude: [1] },
    { label: "no confirmPassword", exclude: [2] },
    { label: "no name", exclude: [3] },
    { label: "no all", exclude: [0, 1, 2, 3, 4, 5] },
  ];
  test.each(generateCases(payload, cases))(
    "should fail when %s (400)",
    async (_, username, password, confirmPassword, name, email, address) => {
      const payload = {
        username,
        password,
        confirmPassword,
        name,
        email,
        address,
      };
      const res = await app.request("/auth/signup", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
      const data: TResponse<ZodError> = await res.json();
      expect(res.status).toBe(400);
      expect(data.error?.issues).toBeArray();
      expect(data.status).toBe("Failed");
    }
  );

  it("should fail when password confirmation is different (400)", async () => {
    const newPayload = {
      ...payload,
      confirmPassword: "DIFFERENT-PASSWORD",
    };
    const res = await app.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(newPayload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: TResponse<ZodError> = await res.json();
    expect(res.status).toBe(400);
    expect(data.error?.issues).toBeArray();
  });

  it("should create account successfully (200)", async () => {
    const res = await app.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: TResponse<User> = await res.json();
    expect(res.status).toBe(200);
    expect(data.data?.id).toBeString();
  });

  it("should faill when username already exist (409)", async () => {
    const res = await app.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: TResponse<Prisma.PrismaClientKnownRequestError> =
      await res.json();
    expect(res.status).toBe(409);
    expect(data.status).toBe("Failed");
    expect(data.error?.code).toBe("P2002");
  });
});

describe("Create admin account", () => {
  const password = faker.internet.password();
  const payload = {
    username: faker.internet.userName(),
    password: password,
    confirmPassword: password,
    name: faker.internet.displayName(),
    email: faker.internet.email(),
    address: faker.location.streetAddress({ useFullAddress: true }),
    isAdmin: true,
  };
  it("should create account successfully (200)", async () => {
    const res = await app.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: TResponse<User> = await res.json();
    expect(res.status).toBe(200);
    expect(data.data?.isAdmin).toBe(true);
  });
});

describe("Login", () => {
  it.each([
    ["wrong username", "username"],
    ["wrong password", "password"],
  ])("should fail when %s (401)", async (_, key) => {
    const newPayload = {
      username,
      password,
      [key]: `WRONG-${key}`,
    };
    const res = await app.request("/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPayload),
    });
    const data: TResponse = await res.json();
    expect(res.status).toBe(401);
    expect(data.status).toBe("Failed");
    expect(data.message).toInclude("Wrong");
  });

  it("should login successfully (200)", async () => {
    const res = await app.request("/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data: TResponse<{ token: string; user: Omit<User, "password"> }> =
      await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe("Success");
    expect(data.data?.user.id).toBeString();
    expect(data.data?.token).toBeString();
  });
});
