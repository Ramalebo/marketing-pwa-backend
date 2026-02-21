-- Fix database column names to match Sequelize model expectations
-- Run this in phpMyAdmin on your FreeSQLDatabase.com database (sql12815354)
-- This version handles foreign key constraints safely

-- ============================================
-- STEP 1: Drop all foreign key constraints
-- ============================================

-- Drop foreign keys from clients table
ALTER TABLE clients DROP FOREIGN KEY IF EXISTS clients_ibfk_1;

-- Drop foreign keys from users table
ALTER TABLE users DROP FOREIGN KEY IF EXISTS users_ibfk_1;

-- Drop foreign keys from notes table
ALTER TABLE notes DROP FOREIGN KEY IF EXISTS notes_ibfk_1;
ALTER TABLE notes DROP FOREIGN KEY IF EXISTS notes_ibfk_2;

-- Drop foreign keys from ads table
ALTER TABLE ads DROP FOREIGN KEY IF EXISTS ads_ibfk_1;
ALTER TABLE ads DROP FOREIGN KEY IF EXISTS ads_ibfk_2;

-- Drop foreign keys from customer_contacts table
ALTER TABLE customer_contacts DROP FOREIGN KEY IF EXISTS customer_contacts_ibfk_1;
ALTER TABLE customer_contacts DROP FOREIGN KEY IF EXISTS customer_contacts_ibfk_2;

-- Drop foreign keys from post_history table
ALTER TABLE post_history DROP FOREIGN KEY IF EXISTS post_history_ibfk_1;
ALTER TABLE post_history DROP FOREIGN KEY IF EXISTS post_history_ibfk_2;

-- Drop foreign keys from templates table
ALTER TABLE templates DROP FOREIGN KEY IF EXISTS templates_ibfk_1;

-- ============================================
-- STEP 2: Rename columns (one table at a time)
-- ============================================

-- Fix clients table columns
ALTER TABLE clients 
  CHANGE COLUMN businessName business_name VARCHAR(255) NULL,
  CHANGE COLUMN phoneNumber phone_number VARCHAR(50) NOT NULL,
  CHANGE COLUMN socialMediaFacebook social_media_facebook VARCHAR(255) NULL,
  CHANGE COLUMN socialMediaInstagram social_media_instagram VARCHAR(255) NULL,
  CHANGE COLUMN socialMediaTwitter social_media_twitter VARCHAR(255) NULL,
  CHANGE COLUMN socialMediaLinkedin social_media_linkedin VARCHAR(255) NULL,
  CHANGE COLUMN socialMediaWebsite social_media_website VARCHAR(255) NULL,
  CHANGE COLUMN locationAddress location_address TEXT NULL,
  CHANGE COLUMN locationCity location_city VARCHAR(100) NULL,
  CHANGE COLUMN locationState location_state VARCHAR(100) NULL,
  CHANGE COLUMN locationCountry location_country VARCHAR(100) NULL,
  CHANGE COLUMN locationZipCode location_zip_code VARCHAR(20) NULL,
  CHANGE COLUMN locationLat location_lat DECIMAL(10, 8) NULL,
  CHANGE COLUMN locationLng location_lng DECIMAL(11, 8) NULL,
  CHANGE COLUMN createdBy created_by INT NOT NULL,
  CHANGE COLUMN createdAt created_at DATETIME NULL,
  CHANGE COLUMN updatedAt updated_at DATETIME NULL;

-- Fix users table columns
ALTER TABLE users 
  CHANGE COLUMN isMainUser is_main_user BOOLEAN DEFAULT FALSE,
  CHANGE COLUMN createdBy created_by INT NULL,
  CHANGE COLUMN isActive is_active BOOLEAN DEFAULT TRUE,
  CHANGE COLUMN createdAt created_at DATETIME NULL,
  CHANGE COLUMN updatedAt updated_at DATETIME NULL;

-- Fix notes table columns
ALTER TABLE notes 
  CHANGE COLUMN clientId client_id INT NULL,
  CHANGE COLUMN aiRelevant ai_relevant BOOLEAN DEFAULT TRUE,
  CHANGE COLUMN createdBy created_by INT NOT NULL,
  CHANGE COLUMN createdAt created_at DATETIME NULL,
  CHANGE COLUMN updatedAt updated_at DATETIME NULL;

-- Fix ads table columns
ALTER TABLE ads 
  CHANGE COLUMN aiGenerated ai_generated BOOLEAN DEFAULT FALSE,
  CHANGE COLUMN aiPrompt ai_prompt TEXT NULL,
  CHANGE COLUMN contentImages content_images TEXT NULL,
  CHANGE COLUMN contentVideos content_videos TEXT NULL,
  CHANGE COLUMN contentText content_text TEXT NULL,
  CHANGE COLUMN clientId client_id INT NULL,
  CHANGE COLUMN createdBy created_by INT NOT NULL,
  CHANGE COLUMN createdAt created_at DATETIME NULL,
  CHANGE COLUMN updatedAt updated_at DATETIME NULL;

-- Fix customer_contacts table columns
ALTER TABLE customer_contacts 
  CHANGE COLUMN phoneNumber phone_number VARCHAR(50) NOT NULL,
  CHANGE COLUMN clientId client_id INT NOT NULL,
  CHANGE COLUMN createdBy created_by INT NOT NULL,
  CHANGE COLUMN createdAt created_at DATETIME NULL,
  CHANGE COLUMN updatedAt updated_at DATETIME NULL;

-- Fix post_history table columns
ALTER TABLE post_history 
  CHANGE COLUMN adId ad_id INT NOT NULL,
  CHANGE COLUMN postId post_id VARCHAR(255) NULL,
  CHANGE COLUMN publishedAt published_at DATETIME NULL,
  CHANGE COLUMN createdBy created_by INT NOT NULL;

-- Fix templates table columns
ALTER TABLE templates 
  CHANGE COLUMN createdBy created_by INT NOT NULL,
  CHANGE COLUMN createdAt created_at DATETIME NULL,
  CHANGE COLUMN updatedAt updated_at DATETIME NULL;

-- ============================================
-- STEP 3: Re-add foreign key constraints
-- ============================================

-- Re-add foreign keys to users table
ALTER TABLE users 
  ADD CONSTRAINT users_ibfk_1 FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

-- Re-add foreign keys to clients table
ALTER TABLE clients 
  ADD CONSTRAINT clients_ibfk_1 FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE;

-- Re-add foreign keys to notes table
ALTER TABLE notes 
  ADD CONSTRAINT notes_ibfk_1 FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
  ADD CONSTRAINT notes_ibfk_2 FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE;

-- Re-add foreign keys to ads table
ALTER TABLE ads 
  ADD CONSTRAINT ads_ibfk_1 FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
  ADD CONSTRAINT ads_ibfk_2 FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE;

-- Re-add foreign keys to customer_contacts table
ALTER TABLE customer_contacts 
  ADD CONSTRAINT customer_contacts_ibfk_1 FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  ADD CONSTRAINT customer_contacts_ibfk_2 FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE;

-- Re-add foreign keys to post_history table
ALTER TABLE post_history 
  ADD CONSTRAINT post_history_ibfk_1 FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE,
  ADD CONSTRAINT post_history_ibfk_2 FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE;

-- Re-add foreign keys to templates table
ALTER TABLE templates 
  ADD CONSTRAINT templates_ibfk_1 FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE;
