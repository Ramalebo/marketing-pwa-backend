-- Rename columns ONLY if they exist
-- Run CHECK_CURRENT_COLUMNS.sql first to see what needs to be renamed
-- Then run only the ALTER statements for columns that still have camelCase names

-- ============================================
-- STEP 1: Drop foreign keys first (if needed)
-- ============================================
-- Find foreign keys:
-- SELECT CONSTRAINT_NAME, TABLE_NAME 
-- FROM information_schema.KEY_COLUMN_USAGE 
-- WHERE TABLE_SCHEMA = 'sql12815354' 
-- AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Then drop them (replace with actual names):
-- ALTER TABLE clients DROP FOREIGN KEY [actual_name];
-- ALTER TABLE users DROP FOREIGN KEY [actual_name];
-- etc.

-- ============================================
-- STEP 2: Rename columns (only if they exist)
-- ============================================
-- Run CHECK_CURRENT_COLUMNS.sql first to see which columns need renaming
-- Then run the appropriate ALTER statements below

-- Clients table - only rename if columns exist
-- If you see businessName, run this:
-- ALTER TABLE clients CHANGE COLUMN businessName business_name VARCHAR(255) NULL;
-- If you see phoneNumber, run this:
-- ALTER TABLE clients CHANGE COLUMN phoneNumber phone_number VARCHAR(50) NOT NULL;
-- etc.

-- Users table - only rename if columns exist
-- If you see isMainUser, run this:
-- ALTER TABLE users CHANGE COLUMN isMainUser is_main_user BOOLEAN DEFAULT FALSE;
-- If you see createdBy, run this:
-- ALTER TABLE users CHANGE COLUMN createdBy created_by INT NULL;
-- If you see isActive, run this:
-- ALTER TABLE users CHANGE COLUMN isActive is_active BOOLEAN DEFAULT TRUE;
-- If you see createdAt, run this:
-- ALTER TABLE users CHANGE COLUMN createdAt created_at DATETIME NULL;
-- If you see updatedAt, run this:
-- ALTER TABLE users CHANGE COLUMN updatedAt updated_at DATETIME NULL;

-- Notes table - only rename if columns exist
-- ALTER TABLE notes CHANGE COLUMN clientId client_id INT NULL;
-- ALTER TABLE notes CHANGE COLUMN aiRelevant ai_relevant BOOLEAN DEFAULT TRUE;
-- ALTER TABLE notes CHANGE COLUMN createdBy created_by INT NOT NULL;
-- ALTER TABLE notes CHANGE COLUMN createdAt created_at DATETIME NULL;
-- ALTER TABLE notes CHANGE COLUMN updatedAt updated_at DATETIME NULL;

-- Ads table - only rename if columns exist
-- ALTER TABLE ads CHANGE COLUMN aiGenerated ai_generated BOOLEAN DEFAULT FALSE;
-- ALTER TABLE ads CHANGE COLUMN aiPrompt ai_prompt TEXT NULL;
-- ALTER TABLE ads CHANGE COLUMN contentImages content_images TEXT NULL;
-- ALTER TABLE ads CHANGE COLUMN contentVideos content_videos TEXT NULL;
-- ALTER TABLE ads CHANGE COLUMN contentText content_text TEXT NULL;
-- ALTER TABLE ads CHANGE COLUMN clientId client_id INT NULL;
-- ALTER TABLE ads CHANGE COLUMN createdBy created_by INT NOT NULL;
-- ALTER TABLE ads CHANGE COLUMN createdAt created_at DATETIME NULL;
-- ALTER TABLE ads CHANGE COLUMN updatedAt updated_at DATETIME NULL;

-- Customer_contacts table - only rename if columns exist
-- ALTER TABLE customer_contacts CHANGE COLUMN phoneNumber phone_number VARCHAR(50) NOT NULL;
-- ALTER TABLE customer_contacts CHANGE COLUMN clientId client_id INT NOT NULL;
-- ALTER TABLE customer_contacts CHANGE COLUMN createdBy created_by INT NOT NULL;
-- ALTER TABLE customer_contacts CHANGE COLUMN createdAt created_at DATETIME NULL;
-- ALTER TABLE customer_contacts CHANGE COLUMN updatedAt updated_at DATETIME NULL;

-- Post_history table - only rename if columns exist
-- ALTER TABLE post_history CHANGE COLUMN adId ad_id INT NOT NULL;
-- ALTER TABLE post_history CHANGE COLUMN postId post_id VARCHAR(255) NULL;
-- ALTER TABLE post_history CHANGE COLUMN publishedAt published_at DATETIME NULL;
-- ALTER TABLE post_history CHANGE COLUMN createdBy created_by INT NOT NULL;

-- Templates table - only rename if columns exist
-- ALTER TABLE templates CHANGE COLUMN createdBy created_by INT NOT NULL;
-- ALTER TABLE templates CHANGE COLUMN createdAt created_at DATETIME NULL;
-- ALTER TABLE templates CHANGE COLUMN updatedAt updated_at DATETIME NULL;
