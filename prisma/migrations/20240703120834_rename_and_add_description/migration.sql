/*
  Warnings:

  - Added the required column `description` to the `VehicleModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VehicleModel" ADD COLUMN     "description" TEXT NOT NULL;
