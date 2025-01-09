/*
  Warnings:

  - Added the required column `avgPace` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avgSpeed` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `elevation` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Activity` ADD COLUMN `avgPace` INTEGER NOT NULL,
    ADD COLUMN `avgSpeed` INTEGER NOT NULL,
    ADD COLUMN `elevation` INTEGER NOT NULL;
