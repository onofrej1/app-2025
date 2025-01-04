/*
  Warnings:

  - Added the required column `name` to the `SportActivity` table without a default value. This is not possible if the table is not empty.
  - Made the column `type` on table `SportActivity` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `SportActivity` ADD COLUMN `name` VARCHAR(191) NOT NULL,
    MODIFY `type` VARCHAR(191) NOT NULL;
