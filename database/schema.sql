CREATE TABLE `users` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM ('admin', 'staff') DEFAULT 'staff',
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `categories` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) UNIQUE,
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `locations` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `city` VARCHAR(100),
  `district` VARCHAR(100),
  `ward` VARCHAR(100),
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `properties` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) UNIQUE,
  `price` BIGINT,
  `area` FLOAT,
  `bedrooms` INT,
  `bathrooms` INT,
  `direction` VARCHAR(20),
  `status` ENUM ('ban', 'cho-thue') NOT NULL,
  `description` LONGTEXT,
  `is_featured` BOOLEAN DEFAULT 0,
  `category_id` INT,
  `location_id` INT,
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `property_images` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `property_id` INT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `is_main` BOOLEAN DEFAULT 0
);

CREATE TABLE `property_features` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL
);

CREATE TABLE `property_feature_map` (
  `property_id` INT NOT NULL,
  `feature_id` INT NOT NULL,
  PRIMARY KEY (`property_id`, `feature_id`)
);

CREATE TABLE `news` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) UNIQUE,
  `content` LONGTEXT,
  `image` VARCHAR(255),
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `contacts` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100),
  `phone` VARCHAR(20),
  `email` VARCHAR(100),
  `message` TEXT,
  `property_id` INT,
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `settings` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `site_name` VARCHAR(100),
  `hotline` VARCHAR(20),
  `email` VARCHAR(100),
  `address` VARCHAR(255),
  `logo` VARCHAR(255)
);

CREATE INDEX `idx_property_price` ON `properties` (`price`);

CREATE INDEX `idx_property_area` ON `properties` (`area`);

CREATE INDEX `idx_property_status` ON `properties` (`status`);

CREATE INDEX `idx_property_category` ON `properties` (`category_id`);

CREATE INDEX `idx_property_location` ON `properties` (`location_id`);

ALTER TABLE `properties` ADD CONSTRAINT `fk_property_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

ALTER TABLE `properties` ADD CONSTRAINT `fk_property_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL;

ALTER TABLE `property_images` ADD CONSTRAINT `fk_image_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE;

ALTER TABLE `property_feature_map` ADD CONSTRAINT `fk_pf_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE;

ALTER TABLE `property_feature_map` ADD CONSTRAINT `fk_pf_feature` FOREIGN KEY (`feature_id`) REFERENCES `property_features` (`id`) ON DELETE CASCADE;

ALTER TABLE `contacts` ADD CONSTRAINT `fk_contact_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE SET NULL;
