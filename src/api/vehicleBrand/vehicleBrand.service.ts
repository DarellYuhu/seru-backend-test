import prisma from "@database";
import { Prisma } from "@prisma/client";

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

export default { create, getAll };
