-- Add AdFlow-style columns to ads table (campaign, adset, platform, format, etc.)
-- Run once. If columns already exist (e.g. from Sequelize sync alter), skip or run one-by-one and ignore "Duplicate column" errors.

ALTER TABLE ads
  ADD COLUMN campaign VARCHAR(255) NULL,
  ADD COLUMN adset VARCHAR(255) NULL,
  ADD COLUMN platform VARCHAR(64) NULL,
  ADD COLUMN format VARCHAR(64) NULL,
  ADD COLUMN placement VARCHAR(128) NULL,
  ADD COLUMN ad_type VARCHAR(64) NULL,
  ADD COLUMN cta VARCHAR(64) NULL,
  ADD COLUMN headline VARCHAR(500) NULL,
  ADD COLUMN destination_url VARCHAR(1024) NULL;
