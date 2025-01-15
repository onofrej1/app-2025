/*
  Warnings:

  - The `emailVerified` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_parentId_fkey`;

-- DropIndex
DROP INDEX `Comment_parentId_fkey` ON `Comment`;

-- AlterTable
ALTER TABLE `Attendee` MODIFY `attended` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Comment` MODIFY `parentId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Event` ADD COLUMN `onlineLink` VARCHAR(191) NULL,
    MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `Message` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Post` MODIFY `content` TEXT NOT NULL,
    MODIFY `summary` TEXT NULL;

-- AlterTable
ALTER TABLE `Task` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `priority` VARCHAR(191) NULL,
    ADD COLUMN `type` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `TaskComment` MODIFY `comment` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `emailVerified`,
    ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Comment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
