-- Fix database column names to match Sequelize model expectations
-- Run this in phpMyAdmin on your FreeSQLDatabase.com database (sql12815354)

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
