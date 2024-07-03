import prisma from "@database";
import { faker } from "@faker-js/faker";

async function main() {
  const vehicleBrand = Array.from({ length: 20 }).map(() => ({
    name: faker.vehicle.manufacturer(),
    country: faker.location.country(),
    logoUri: faker.internet.url(),
    websiteUri: faker.internet.url(),
    description: faker.lorem.paragraph(),
  }));
  const vehicles = await prisma.vehicleBrand.createManyAndReturn({
    data: vehicleBrand,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
