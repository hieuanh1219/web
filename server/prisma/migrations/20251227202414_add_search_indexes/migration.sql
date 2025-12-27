-- CreateIndex
CREATE INDEX `Property_status_title_idx` ON `Property`(`status`, `title`);

-- CreateIndex
CREATE INDEX `Property_status_address_idx` ON `Property`(`status`, `address`);
