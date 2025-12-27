/*
  Warnings:

  - The values [PENDING,REJECTED] on the enum `Property_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `property` MODIFY `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT';

-- CreateIndex
CREATE INDEX `Property_status_publishedAt_idx` ON `Property`(`status`, `publishedAt`);

-- CreateIndex
CREATE INDEX `Property_status_price_idx` ON `Property`(`status`, `price`);

-- CreateIndex
CREATE INDEX `Property_status_area_idx` ON `Property`(`status`, `area`);

-- CreateIndex
CREATE INDEX `Property_status_locationId_idx` ON `Property`(`status`, `locationId`);

-- CreateIndex
CREATE INDEX `Property_status_typeId_idx` ON `Property`(`status`, `typeId`);
