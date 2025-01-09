/*
  Warnings:

  - You are about to alter the column `elevation` on the `ActivityData` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Account` DROP FOREIGN KEY `Account_userId_fkey`;

-- AlterTable
ALTER TABLE `ActivityData` MODIFY `elevation` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `role` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Account`;

-- DropTable
DROP TABLE `VerificationToken`;
