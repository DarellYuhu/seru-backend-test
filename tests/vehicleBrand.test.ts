import app from "@app";
import { faker } from "@faker-js/faker";
import { Prisma, VehicleBrand } from "@prisma/client";
import { expect, it, describe, beforeAll, afterAll } from "bun:test";
import { clearDatabase, generateCases, seedDatabase } from "./helpers";
import { ZodError } from "zod";
import authService from "../src/api/auth/auth.service";

let country: string;
let name: string;
let id: string;
let accessToken: string;
let userToken: string;

beforeAll(async () => {
  try {
    const { vehicles, admin, user } = await seedDatabase();
    country = vehicles[0].country;
    name = vehicles[0].name;
    id = vehicles[0].id;

    const { token } = await authService.signIn(admin.username, admin.password);
    accessToken = token;

    const userCred = await authService.signIn(user.username, user.password);
    userToken = userCred.token;
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

describe("Create new brand", () => {
  const payload: Prisma.VehicleBrandCreateInput = {
    name: faker.company.name(),
    country: faker.location.country(),
    description: faker.lorem.paragraph(),
    logoUri: faker.internet.url(),
    websiteUri: faker.internet.url(),
  };
  const cases = [
    { label: "no name", exclude: [0] },
    { label: "no country", exclude: [1] },
    { label: "no description", exclude: [2] },
    { label: "no logoUri", exclude: [3] },
    { label: "no websiteUri", exclude: [4] },
    { label: "no all", exclude: [0, 1, 2, 3, 4] },
  ];

  it.each(generateCases(payload, cases))(
    "should fail when %s",
    async (_, name, country, description, logoUri, websiteUri) => {
      const payload = { name, country, description, logoUri, websiteUri };
      const res = await app.request("/vehicle-brand", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: TResponse<ZodError> = await res.json();
      expect(res.status).toBe(400);
      expect(data.status).toBe("Failed");
      expect(data.error?.issues.length).toEqual(
        Object.values(payload).filter((item) => item === undefined).length
      );
    }
  );

  it("should create brand successfully", async () => {
    const res = await app.request("/vehicle-brand", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: TResponse<VehicleBrand> = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe("Success");
    expect(data.data?.id).toBeString();
  });
});

describe("Get all brand ", () => {
  it("should get all data successfully", async () => {
    const res = await app.request("/vehicle-brand");
    const data: TResponse<VehicleBrand[]> = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe("Success");
    expect(data.data).toBeArray();
    expect(data.metadata).toBeObject();
  });
  it("should get data by page successfully", async () => {
    const res = await app.request("/vehicle-brand?page=2");
    const data: TResponse<VehicleBrand[]> = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe("Success");
    expect(data.data).toBeArray();
    expect(data.metadata).toBeObject();
    expect(data.metadata?.page).toBe(2);
  });
  it("should get data by page and limit successfully", async () => {
    const res = await app.request("/vehicle-brand?page=2&limit=5");
    const data: TResponse<VehicleBrand[]> = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe("Success");
    expect(data.data).toBeArray();
    expect(data.metadata).toBeObject();
    expect(data.metadata?.limit).toBe(5);
  });
  it("should get data filtered by country", async () => {
    const res = await app.request(`/vehicle-brand?limit=5&country=${country}`);
    const data: TResponse<VehicleBrand[]> = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe("Success");
    expect(data.data).toBeArray();
    expect(data.metadata).toBeObject();
    expect(data.metadata?.limit).toBe(5);
    expect(data.data?.[0]).toContainValue(country);
  });
  it("should get data filtered by name", async () => {
    const res = await app.request(`/vehicle-brand?limit=5&name=${name}`);
    const data: TResponse<VehicleBrand[]> = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe("Success");
    expect(data.data).toBeArray();
    expect(data.metadata).toBeObject();
    expect(data.metadata?.limit).toBe(5);
    expect(data.data?.[0]).toContainValue(name);
  });
});

describe("Get by id", () => {
  it("should fail get the data because not found", async () => {
    const res = await app.request(`/vehicle-brand/${id}-NOT-FOUND`);
    const data: TResponse<VehicleBrand> = await res.json();
    expect(res.status).toBe(404);
    expect(data.status).toBe("Failed");
  });
  it("should succesfully get brand by id", async () => {
    const res = await app.request(`/vehicle-brand/${id}`);
    const data: TResponse<VehicleBrand> = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe("Success");
    expect(data.data?.id).toBeString();
  });
});

describe("update by id", () => {
  const payload: Prisma.VehicleBrandUpdateWithoutVehicleTypeInput = {
    name: faker.vehicle.manufacturer(),
    country: faker.location.country(),
    description: faker.lorem.paragraph(),
    logoUri: faker.internet.url(),
    websiteUri: faker.internet.url(),
  };

  it("should fail when not authenticated", async () => {
    const res = await app.request(`/vehicle-brand/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: TResponse<VehicleBrand> = await res.json();
    expect(res.status).toBe(401);
    expect(data.status).toBe("Failed");
  });

  it("should fail when not authorized", async () => {
    const res = await app.request(`/vehicle-brand/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });
    const data: TResponse<VehicleBrand> = await res.json();
    expect(res.status).toBe(403);
    expect(data.status).toBe("Failed");
  });

  it("should fail update non exist data", async () => {
    const res = await app.request(`/vehicle-brand/${id}-NON-EXIST`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data: TResponse<Prisma.PrismaClientKnownRequestError> =
      await res.json();
    expect(res.status).toBe(404);
    expect(data.status).toBe("Failed");
    expect(data.error?.code).toBe("P2025");
  });

  it.each(["name", "country", "description", "logoUri", "websiteUri"])(
    "should success update the %s in vehicle brand data",
    async (key) => {
      const newPayload = {
        [key]:
          payload[
            key as keyof Prisma.VehicleBrandUpdateWithoutVehicleTypeInput
          ],
      };
      const res = await app.request(`/vehicle-brand/${id}`, {
        method: "PATCH",
        body: JSON.stringify(newPayload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data: TResponse<VehicleBrand> = await res.json();
      expect(res.status).toBe(200);
      expect(data.status).toBe("Success");
      expect(data.data?.[key as keyof VehicleBrand]).toBe(
        payload[
          key as keyof Prisma.VehicleBrandUpdateWithoutVehicleTypeInput
        ] as string
      );
    }
  );
});

describe("delete data by id", () => {
  it("should fail delete non exist data", async () => {
    const res = await app.request(`/vehicle-brand/${id}-NON-EXIST`, {
      method: "DELETE",
    });
    const data: TResponse<Prisma.PrismaClientKnownRequestError> =
      await res.json();
    expect(res.status).toBe(404);
    expect(data.status).toBe("Failed");
    expect(data.error?.code).toBe("P2025");
  });

  it("should delete data successfully", async () => {
    const res = await app.request(`/vehicle-brand/${id}`, { method: "DELETE" });
    const data: TResponse<VehicleBrand> = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe("Success");
    expect(data.data?.id).toBeString();
  });
});
