/*
  Warnings:

  - You are about to drop the column `team` on the `RunResult` table. All the data in the column will be lost.
  - Added the required column `club` to the `RunResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `RunResult` DROP COLUMN `team`,
    ADD COLUMN `club` VARCHAR(191) NOT NULL;
