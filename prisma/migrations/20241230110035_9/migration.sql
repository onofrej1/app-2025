-- DropForeignKey
ALTER TABLE `Conversation` DROP FOREIGN KEY `Conversation_lastMessageId_fkey`;

-- DropIndex
DROP INDEX `Conversation_lastMessageId_fkey` ON `Conversation`;

-- AlterTable
ALTER TABLE `Conversation` MODIFY `lastMessageId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Conversation` ADD CONSTRAINT `Conversation_lastMessageId_fkey` FOREIGN KEY (`lastMessageId`) REFERENCES `Message`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
