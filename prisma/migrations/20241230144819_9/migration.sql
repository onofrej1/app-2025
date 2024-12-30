-- DropForeignKey
ALTER TABLE `ConversationMember` DROP FOREIGN KEY `ConversationMember_lastSeenMessageId_fkey`;

-- DropIndex
DROP INDEX `ConversationMember_lastSeenMessageId_fkey` ON `ConversationMember`;

-- AlterTable
ALTER TABLE `ConversationMember` MODIFY `lastSeenMessageId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `ConversationMember` ADD CONSTRAINT `ConversationMember_lastSeenMessageId_fkey` FOREIGN KEY (`lastSeenMessageId`) REFERENCES `Message`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
