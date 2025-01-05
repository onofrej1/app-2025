/*
  Warnings:

  - You are about to drop the column `locality` on the `Venue` table. All the data in the column will be lost.
  - Added the required column `location` to the `Venue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Venue` DROP COLUMN `locality`,
    ADD COLUMN `location` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `_RunToRunCategory` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RunToRunCategory_AB_unique`(`A`, `B`),
    INDEX `_RunToRunCategory_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_RunToRunCategory` ADD CONSTRAINT `_RunToRunCategory_A_fkey` FOREIGN KEY (`A`) REFERENCES `Run`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RunToRunCategory` ADD CONSTRAINT `_RunToRunCategory_B_fkey` FOREIGN KEY (`B`) REFERENCES `RunCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
