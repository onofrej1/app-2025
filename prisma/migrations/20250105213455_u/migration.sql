/*
  Warnings:

  - Changed the type of `yearOfBirth` on the `RunResult` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `RunResult` DROP COLUMN `yearOfBirth`,
    ADD COLUMN `yearOfBirth` INTEGER NOT NULL;
