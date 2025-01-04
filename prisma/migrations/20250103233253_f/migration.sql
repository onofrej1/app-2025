/*
  Warnings:

  - You are about to alter the column `lat` on the `DeviceData` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `long` on the `DeviceData` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `DeviceData` MODIFY `lat` DOUBLE NOT NULL,
    MODIFY `long` DOUBLE NOT NULL;
