/*
  Warnings:

  - You are about to alter the column `tshirtSize` on the `Registration` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `Event` MODIFY `location` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Registration` MODIFY `tshirtSize` ENUM('S', 'M', 'L', 'XL', 'XXL', 'XXXL') NULL;

-- AlterTable
ALTER TABLE `Run` ADD COLUMN `tshirt` BOOLEAN NOT NULL DEFAULT false;
