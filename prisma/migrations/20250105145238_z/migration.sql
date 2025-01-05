/*
  Warnings:

  - You are about to drop the column `name` on the `Tag` table. All the data in the column will be lost.
  - Added the required column `title` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Post` MODIFY `publishedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Tag` DROP COLUMN `name`,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;
