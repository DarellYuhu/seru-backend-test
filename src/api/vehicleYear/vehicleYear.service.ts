import prisma from "@database";
import { Prisma } from "@prisma/client";
import { HTTPException } from "hono/http-exception";

const create = async (data: Prisma.VehicleYearUncheckedCreateInput) => {
  return prisma.vehicleYear.create({
    data,
  });
};

const getAll = async (limit = 10, page = 1, query?: { year?: string }) => {
  const { _count } = await prisma.vehicleYear.aggregate({
    _count: {
      _all: true,
    },
    where: {
      year: {
        contains: query?.year,
        mode: "insensitive",
      },
    },
  });
  const totalAll = _count._all;
  const totalPage = Math.ceil(totalAll / limit);
  const offset = (page - 1) * limit;
  const data = await prisma.vehicleYear.findMany({
    take: limit,
    skip: offset,
    where: {
      year: {
        contains: query?.year,
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
  const vehicleYear = await prisma.vehicleYear.findUnique({
    where: { id },
  });
  if (!vehicleYear) {
    throw new HTTPException(404, {
      message: "Data you are searching for is unavailable",
    });
  }
  return vehicleYear;
};

const update = async (
  id: string,
  payload: Prisma.VehicleYearUncheckedUpdateInput
) => {
  return await prisma.vehicleYear.update({
    where: { id },
    data: payload,
  });
};

const _delete = async (id: string) => {
  return await prisma.vehicleYear.delete({
    where: { id },
  });
};

export default { create, getAll, getById, update, _delete };
