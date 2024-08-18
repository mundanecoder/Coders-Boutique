/*
  Warnings:

  - You are about to alter the column `role` on the `UserRole` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - Made the column `userId` on table `PasswordReset` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `PasswordReset` DROP FOREIGN KEY `PasswordReset_userId_fkey`;

-- AlterTable
ALTER TABLE `PasswordReset` MODIFY `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `UserRole` MODIFY `role` ENUM('Admin', 'Regular') NOT NULL;

-- AddForeignKey
ALTER TABLE `PasswordReset` ADD CONSTRAINT `PasswordReset_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
