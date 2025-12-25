-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `avatarUrl` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'DISABLED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_status_createdAt_idx`(`status`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` VARCHAR(191) NOT NULL,
    `code` ENUM('ADMIN', 'EDITOR', 'MODERATOR') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Role_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRole` (
    `userId` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,

    INDEX `UserRole_roleId_idx`(`roleId`),
    PRIMARY KEY (`userId`, `roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AgentProfile` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `bio` LONGTEXT NULL,
    `facebook` VARCHAR(191) NULL,
    `zalo` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AgentProfile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NULL,
    `parentId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Location_slug_key`(`slug`),
    INDEX `Location_parentId_idx`(`parentId`),
    INDEX `Location_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PropertyType` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PropertyType_name_key`(`name`),
    UNIQUE INDEX `PropertyType_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Amenity` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Amenity_name_key`(`name`),
    UNIQUE INDEX `Amenity_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PropertyAmenity` (
    `propertyId` VARCHAR(191) NOT NULL,
    `amenityId` VARCHAR(191) NOT NULL,

    INDEX `PropertyAmenity_amenityId_idx`(`amenityId`),
    PRIMARY KEY (`propertyId`, `amenityId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Tag_slug_key`(`slug`),
    INDEX `Tag_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PropertyTag` (
    `propertyId` VARCHAR(191) NOT NULL,
    `tagId` VARCHAR(191) NOT NULL,

    INDEX `PropertyTag_tagId_idx`(`tagId`),
    PRIMARY KEY (`propertyId`, `tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Property` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `transactionType` ENUM('SALE', 'RENT') NOT NULL,
    `currency` ENUM('VND', 'USD') NOT NULL DEFAULT 'VND',
    `price` DECIMAL(18, 2) NULL,
    `priceMin` DECIMAL(18, 2) NULL,
    `priceMax` DECIMAL(18, 2) NULL,
    `priceUnit` VARCHAR(191) NULL,
    `isNegotiable` BOOLEAN NOT NULL DEFAULT false,
    `area` DECIMAL(10, 2) NULL,
    `landArea` DECIMAL(10, 2) NULL,
    `bedrooms` INTEGER NULL,
    `bathrooms` INTEGER NULL,
    `floors` INTEGER NULL,
    `frontage` DECIMAL(10, 2) NULL,
    `roadWidth` DECIMAL(10, 2) NULL,
    `address` VARCHAR(191) NULL,
    `latitude` DECIMAL(10, 7) NULL,
    `longitude` DECIMAL(10, 7) NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` VARCHAR(191) NULL,
    `canonicalUrl` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PENDING', 'PUBLISHED', 'REJECTED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `publishedAt` DATETIME(3) NULL,
    `locationId` VARCHAR(191) NULL,
    `typeId` VARCHAR(191) NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Property_slug_key`(`slug`),
    INDEX `Property_status_createdAt_idx`(`status`, `createdAt`),
    INDEX `Property_transactionType_status_idx`(`transactionType`, `status`),
    INDEX `Property_authorId_idx`(`authorId`),
    INDEX `Property_locationId_idx`(`locationId`),
    INDEX `Property_typeId_idx`(`typeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PropertyImage` (
    `id` VARCHAR(191) NOT NULL,
    `propertyId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `alt` VARCHAR(191) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PropertyImage_propertyId_sortOrder_idx`(`propertyId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PropertyMedia` (
    `id` VARCHAR(191) NOT NULL,
    `propertyId` VARCHAR(191) NOT NULL,
    `type` ENUM('IMAGE', 'VIDEO', 'VR', 'FILE') NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PropertyMedia_propertyId_type_sortOrder_idx`(`propertyId`, `type`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PropertyFeature` (
    `id` VARCHAR(191) NOT NULL,
    `propertyId` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PropertyFeature_propertyId_idx`(`propertyId`),
    INDEX `PropertyFeature_key_idx`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PropertyReview` (
    `id` VARCHAR(191) NOT NULL,
    `propertyId` VARCHAR(191) NOT NULL,
    `moderatorId` VARCHAR(191) NOT NULL,
    `action` ENUM('APPROVE', 'REJECT') NOT NULL,
    `note` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PropertyReview_propertyId_createdAt_idx`(`propertyId`, `createdAt`),
    INDEX `PropertyReview_moderatorId_idx`(`moderatorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lead` (
    `id` VARCHAR(191) NOT NULL,
    `propertyId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `message` LONGTEXT NULL,
    `status` ENUM('NEW', 'CONTACTED', 'QUALIFIED', 'WON', 'LOST', 'SPAM') NOT NULL DEFAULT 'NEW',
    `source` ENUM('FORM', 'PHONE', 'ZALO', 'FACEBOOK', 'EMAIL', 'OTHER') NOT NULL DEFAULT 'FORM',
    `utmSource` VARCHAR(191) NULL,
    `utmMedium` VARCHAR(191) NULL,
    `utmCampaign` VARCHAR(191) NULL,
    `referrer` VARCHAR(191) NULL,
    `ip` VARCHAR(191) NULL,
    `assignedToId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Lead_phone_idx`(`phone`),
    INDEX `Lead_status_createdAt_idx`(`status`, `createdAt`),
    INDEX `Lead_propertyId_createdAt_idx`(`propertyId`, `createdAt`),
    INDEX `Lead_assignedToId_idx`(`assignedToId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PostCategory_slug_key`(`slug`),
    INDEX `PostCategory_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `excerpt` VARCHAR(191) NULL,
    `content` LONGTEXT NOT NULL,
    `coverUrl` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` VARCHAR(191) NULL,
    `canonicalUrl` VARCHAR(191) NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NULL,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Post_slug_key`(`slug`),
    INDEX `Post_status_createdAt_idx`(`status`, `createdAt`),
    INDEX `Post_authorId_idx`(`authorId`),
    INDEX `Post_categoryId_idx`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostTag` (
    `postId` VARCHAR(191) NOT NULL,
    `tagId` VARCHAR(191) NOT NULL,

    INDEX `PostTag_tagId_idx`(`tagId`),
    PRIMARY KEY (`postId`, `tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Page` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` VARCHAR(191) NULL,
    `canonicalUrl` VARCHAR(191) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Page_slug_key`(`slug`),
    INDEX `Page_isPublished_updatedAt_idx`(`isPublished`, `updatedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactMessage` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `subject` VARCHAR(191) NULL,
    `message` LONGTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ContactMessage_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Setting` (
    `key` VARCHAR(191) NOT NULL,
    `value` LONGTEXT NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AgentProfile` ADD CONSTRAINT `AgentProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Location` ADD CONSTRAINT `Location_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropertyAmenity` ADD CONSTRAINT `PropertyAmenity_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropertyAmenity` ADD CONSTRAINT `PropertyAmenity_amenityId_fkey` FOREIGN KEY (`amenityId`) REFERENCES `Amenity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropertyTag` ADD CONSTRAINT `PropertyTag_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropertyTag` ADD CONSTRAINT `PropertyTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Property` ADD CONSTRAINT `Property_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Property` ADD CONSTRAINT `Property_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Property` ADD CONSTRAINT `Property_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `PropertyType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropertyImage` ADD CONSTRAINT `PropertyImage_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropertyMedia` ADD CONSTRAINT `PropertyMedia_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropertyFeature` ADD CONSTRAINT `PropertyFeature_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropertyReview` ADD CONSTRAINT `PropertyReview_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropertyReview` ADD CONSTRAINT `PropertyReview_moderatorId_fkey` FOREIGN KEY (`moderatorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `PostCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostTag` ADD CONSTRAINT `PostTag_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostTag` ADD CONSTRAINT `PostTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
