import prisma from "@database";
import { Prisma } from "@prisma/client";
import { HTTPException } from "hono/http-exception";

const create = async (data: Prisma.PriceListUncheckedCreateInput) => {
  return prisma.priceList.create({
    data,
  });
};

const getAll = async (
  limit = 10,
  page = 1,
  query?: { code?: string; price?: number }
) => {
  const { _count } = await prisma.priceList.aggregate({
    _count: {
      _all: true,
    },
    where: {
      code: {
        contains: query?.code,
        mode: "insensitive",
      },
      price: {
        equals: query?.price,
      },
    },
  });
  const totalAll = _count._all;
  const totalPage = Math.ceil(totalAll / limit);
  const offset = (page - 1) * limit;
  const data = await prisma.priceList.findMany({
    take: limit,
    skip: offset,
    where: {
      code: {
        contains: query?.code,
        mode: "insensitive",
      },
      price: {
        equals: query?.price,
      },
    },
  });
  return {
    data,
    metadata: { page, limit, totalItem: data.length, totalPage, totalAll },
  };
};

const getById = async (id: string) => {
  const priceList = await prisma.priceList.findUnique({
    where: { id },
  });
  if (!priceList) {
    throw new HTTPException(404, {
      message: "Data you are searching for is unavailable",
    });
  }
  return priceList;
};

const update = async (
  id: string,
  payload: Prisma.PriceListUncheckedUpdateInput
) => {
  return await prisma.priceList.update({
    where: { id },
    data: payload,
  });
};

const _delete = async (id: string) => {
  return await prisma.priceList.delete({
    where: { id },
  });
};

export default { create, getAll, getById, update, _delete };
