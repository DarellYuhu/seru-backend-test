/*
  Warnings:

  - Added the required column `updateAt` to the `PriceList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `VehicleBrand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `VehicleModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `VehicleType` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `isOnroad` on the `VehicleType` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updateAt` to the `VehicleYear` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PriceList" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "VehicleBrand" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "VehicleModel" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "VehicleType" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "isOnroad",
ADD COLUMN     "isOnroad" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "VehicleYear" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;
