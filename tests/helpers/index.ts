import prisma from "@database";
import { faker } from "@faker-js/faker";

const generateCases = (
  payload: {},
  cases: { label: string; exclude: number[] }[]
) => {
  return cases.map((item) => {
    let data = Object.values(payload);
    item.exclude.forEach((element) => {
      data.splice(element, 1, undefined);
    });
    return [item.label, ...data];
  });
};

const clearDatabase = async () => {
  await prisma.$transaction([prisma.user.deleteMany()]);
};

const seedDatabase = async () => {
  const pass = faker.internet.password();
  const userPayload = {
    username: faker.internet.userName(),
    password: await Bun.password.hash(pass, "bcrypt"),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    address: faker.location.streetAddress({ useFullAddress: true }),
  };
  const user = await prisma.user.create({
    data: userPayload,
  });
  user.password = pass;
  return { user };
};

export { generateCases, clearDatabase, seedDatabase };
