import prisma from "@database";
import { Prisma } from "@prisma/client";
import { HTTPException } from "hono/http-exception";

const create = async (data: Prisma.VehicleModelUncheckedCreateInput) => {
  return prisma.vehicleModel.create({
    data,
  });
};

const getAll = async (limit = 10, page = 1, query?: { name?: string }) => {
  const { _count } = await prisma.vehicleModel.aggregate({
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
  const data = await prisma.vehicleModel.findMany({
    take: limit,
    skip: offset,
    where: {
      name: {
        contains: query?.name,
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
  const vehicleModel = await prisma.vehicleModel.findUnique({
    where: { id },
  });
  if (!vehicleModel) {
    throw new HTTPException(404, {
      message: "Data you are searching for is unavailable",
    });
  }
  return vehicleModel;
};

const update = async (
  id: string,
  payload: Prisma.VehicleModelUpdateWithoutVehicleTypeInput
) => {
  return await prisma.vehicleModel.update({
    where: { id },
    data: payload,
  });
};

const _delete = async (id: string) => {
  return await prisma.vehicleModel.delete({
    where: { id },
  });
};

export default { create, getAll, getById, update, _delete };
