import prisma from "@database";
import { Prisma } from "@prisma/client";
import { HTTPException } from "hono/http-exception";

const create = async (data: Prisma.VehicleBrandCreateInput) => {
  return prisma.vehicleBrand.create({
    data,
  });
};

const getAll = async (
  limit = 10,
  page = 1,
  query?: { name?: string; country?: string }
) => {
  const { _count } = await prisma.vehicleBrand.aggregate({
    _count: {
      _all: true,
    },
    where: {
      name: {
        contains: query?.name,
        mode: "insensitive",
      },
      country: {
        contains: query?.country,
        mode: "insensitive",
      },
    },
  });
  const totalAll = _count._all;
  const totalPage = Math.ceil(totalAll / limit);
  const offset = (page - 1) * limit;
  const data = await prisma.vehicleBrand.findMany({
    take: limit,
    skip: offset,
    where: {
      name: {
        contains: query?.name,
        mode: "insensitive",
      },
      country: {
        contains: query?.country,
        mode: "insensitive",
      },
    },
  });
  return {
    data,
    metadata: { page, limit, totalItem: data.length, totalPage, totalAll },
  };
};

const getById = async (id: string) => {
  const vehicleBrand = await prisma.vehicleBrand.findUnique({
    where: { id },
  });
  if (!vehicleBrand) {
    throw new HTTPException(404, {
      message: "Data you are searching for is unavailable",
    });
  }
  return vehicleBrand;
};

const update = async (
  id: string,
  payload: Prisma.VehicleBrandUpdateWithoutVehicleTypeInput
) => {
  return await prisma.vehicleBrand.update({
    where: { id },
    data: payload,
  });
};

const _delete = async (id: string) => {
  return await prisma.vehicleBrand.delete({
    where: { id },
  });
};

export default { create, getAll, getById, update, _delete };
