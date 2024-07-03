import prisma from "@database";
import { Prisma } from "@prisma/client";
import { HTTPException } from "hono/http-exception";

const create = async (data: Prisma.VehicleTypeUncheckedCreateInput) => {
  return prisma.vehicleType.create({
    data,
    include: {
      VehicleBrand: true,
    },
  });
};

const getAll = async (limit = 10, page = 1, query?: { name?: string }) => {
  const { _count } = await prisma.vehicleType.aggregate({
    _count: {
      _all: true,
    },
    where: {
      name: {
        contains: query?.name,
        mode: "insensitive",
      },
    },
  });
  const totalAll = _count._all;
  const totalPage = Math.ceil(totalAll / limit);
  const offset = (page - 1) * limit;
  const data = await prisma.vehicleType.findMany({
    take: limit,
    skip: offset,
    where: {
      name: {
        contains: query?.name,
        mode: "insensitive",
      },
    },
    include: {
      VehicleBrand: true,
    },
  });
  return {
    data,
    metadata: { page, limit, totalItem: data.length, totalPage, totalAll },
  };
};

const getById = async (id: string) => {
  const vehicleType = await prisma.vehicleType.findUnique({
    where: { id },
    include: {
      VehicleBrand: true,
    },
  });
  if (!vehicleType) {
    throw new HTTPException(404, {
      message: "Data you are searching for is unavailable",
    });
  }
  return vehicleType;
};

const update = async (
  id: string,
  payload: Prisma.VehicleTypeUncheckedUpdateInput
) => {
  return await prisma.vehicleType.update({
    where: { id },
    data: payload,
    include: {
      VehicleBrand: true,
    },
  });
};

const _delete = async (id: string) => {
  return await prisma.vehicleType.delete({
    where: { id },
  });
};

export default { create, getAll, getById, update, _delete };
