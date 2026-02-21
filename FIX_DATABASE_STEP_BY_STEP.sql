-- Alternative: Run each ALTER TABLE separately if the above fails
-- Copy and paste ONE section at a time into phpMyAdmin SQL tab

-- ============================================
-- OPTION 1: Check current foreign key names first
-- ============================================
-- Run this to see what foreign keys exist:
-- SELECT CONSTRAINT_NAME, TABLE_NAME 
-- FROM information_schema.KEY_COLUMN_USAGE 
-- WHERE TABLE_SCHEMA = 'sql12815354' 
-- AND REFERENCED_TABLE_NAME IS NOT NULL;

-- ============================================
-- OPTION 2: Drop foreign keys (run this first)
-- ============================================

-- Get the actual foreign key names from the query above, then run:
-- ALTER TABLE clients DROP FOREIGN KEY [actual_key_name];
-- ALTER TABLE users DROP FOREIGN KEY [actual_key_name];
-- ALTER TABLE notes DROP FOREIGN KEY [actual_key_name];
-- ALTER TABLE ads DROP FOREIGN KEY [actual_key_name];
-- etc.

-- ============================================
-- OPTION 3: Rename columns ONE table at a time
-- ============================================

-- Run this FIRST (clients table):
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

-- Then run this (users table):
ALTER TABLE users 
  CHANGE COLUMN isMainUser is_main_user BOOLEAN DEFAULT FALSE,
  CHANGE COLUMN createdBy created_by INT NULL,
  CHANGE COLUMN isActive is_active BOOLEAN DEFAULT TRUE,
  CHANGE COLUMN createdAt created_at DATETIME NULL,
  CHANGE COLUMN updatedAt updated_at DATETIME NULL;

-- Then run this (notes table):
ALTER TABLE notes 
  CHANGE COLUMN clientId client_id INT NULL,
  CHANGE COLUMN aiRelevant ai_relevant BOOLEAN DEFAULT TRUE,
  CHANGE COLUMN createdBy created_by INT NOT NULL,
  CHANGE COLUMN createdAt created_at DATETIME NULL,
  CHANGE COLUMN updatedAt updated_at DATETIME NULL;

-- Then run this (ads table):
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

-- Then run this (customer_contacts table):
ALTER TABLE customer_contacts 
  CHANGE COLUMN phoneNumber phone_number VARCHAR(50) NOT NULL,
  CHANGE COLUMN clientId client_id INT NOT NULL,
  CHANGE COLUMN createdBy created_by INT NOT NULL,
  CHANGE COLUMN createdAt created_at DATETIME NULL,
  CHANGE COLUMN updatedAt updated_at DATETIME NULL;

-- Then run this (post_history table):
ALTER TABLE post_history 
  CHANGE COLUMN adId ad_id INT NOT NULL,
  CHANGE COLUMN postId post_id VARCHAR(255) NULL,
  CHANGE COLUMN publishedAt published_at DATETIME NULL,
  CHANGE COLUMN createdBy created_by INT NOT NULL;

-- Then run this (templates table):
ALTER TABLE templates 
  CHANGE COLUMN createdBy created_by INT NOT NULL,
  CHANGE COLUMN createdAt created_at DATETIME NULL,
  CHANGE COLUMN updatedAt updated_at DATETIME NULL;
