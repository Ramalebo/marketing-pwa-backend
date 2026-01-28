-- MySQL Database Schema for Marketing PWA
-- Use this version if database already exists (remove CREATE DATABASE and USE lines)

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  isMainUser BOOLEAN DEFAULT FALSE,
  createdBy INT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt DATETIME NULL,
  updatedAt DATETIME NULL,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY idx_email (email(191)),
  INDEX idx_createdBy (createdBy)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  businessName VARCHAR(255) NULL,
  phoneNumber VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  socialMediaFacebook VARCHAR(255) NULL,
  socialMediaInstagram VARCHAR(255) NULL,
  socialMediaTwitter VARCHAR(255) NULL,
  socialMediaLinkedin VARCHAR(255) NULL,
  socialMediaWebsite VARCHAR(255) NULL,
  locationAddress TEXT NULL,
  locationCity VARCHAR(100) NULL,
  locationState VARCHAR(100) NULL,
  locationCountry VARCHAR(100) NULL,
  locationZipCode VARCHAR(20) NULL,
  locationLat DECIMAL(10, 8) NULL,
  locationLng DECIMAL(11, 8) NULL,
  tags TEXT NULL,
  createdBy INT NOT NULL,
  createdAt DATETIME NULL,
  updatedAt DATETIME NULL,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_createdBy (createdBy),
  INDEX idx_email (email(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  clientId INT NULL,
  category ENUM('general', 'preference', 'interaction', 'campaign', 'other') DEFAULT 'general',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  aiRelevant BOOLEAN DEFAULT TRUE,
  createdBy INT NOT NULL,
  createdAt DATETIME NULL,
  updatedAt DATETIME NULL,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE SET NULL,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_clientId (clientId),
  INDEX idx_createdBy (createdBy),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ads table
CREATE TABLE IF NOT EXISTS ads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  type ENUM('image', 'video', 'carousel', 'story') NOT NULL,
  aiGenerated BOOLEAN DEFAULT FALSE,
  aiPrompt TEXT NULL,
  contentImages TEXT NULL,
  contentVideos TEXT NULL,
  contentText TEXT NULL,
  status ENUM('draft', 'pending', 'approved', 'published', 'archived') DEFAULT 'draft',
  clientId INT NULL,
  createdBy INT NOT NULL,
  createdAt DATETIME NULL,
  updatedAt DATETIME NULL,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE SET NULL,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_clientId (clientId),
  INDEX idx_createdBy (createdBy),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customer Contacts table
CREATE TABLE IF NOT EXISTS customer_contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phoneNumber VARCHAR(50) NOT NULL,
  clientId INT NOT NULL,
  tags TEXT NULL,
  notes TEXT NULL,
  createdBy INT NOT NULL,
  createdAt DATETIME NULL,
  updatedAt DATETIME NULL,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_clientId (clientId),
  INDEX idx_createdBy (createdBy),
  INDEX idx_email (email(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Post History table
CREATE TABLE IF NOT EXISTS post_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  adId INT NOT NULL,
  platform ENUM('facebook', 'instagram', 'whatsapp') NOT NULL,
  postId VARCHAR(255) NULL,
  status ENUM('success', 'failed', 'pending') DEFAULT 'pending',
  message TEXT NULL,
  error TEXT NULL,
  publishedAt DATETIME NULL,
  createdBy INT NOT NULL,
  FOREIGN KEY (adId) REFERENCES ads(id) ON DELETE CASCADE,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_adId (adId),
  INDEX idx_platform (platform),
  INDEX idx_createdBy (createdBy)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('email', 'sms', 'social') NOT NULL,
  subject VARCHAR(255) NULL,
  content TEXT NOT NULL,
  variables TEXT NULL,
  createdBy INT NOT NULL,
  createdAt DATETIME NULL,
  updatedAt DATETIME NULL,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_type (type),
  INDEX idx_createdBy (createdBy)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
