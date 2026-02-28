-- ============================================================
-- Deploy all migrations: Campaign (AdFlow) + Dashboard + Outdoor + Beacons
-- ============================================================
-- Run in phpMyAdmin (select your DB first) or: mysql -u user -p dbname < deploy_all_migrations.sql
--
-- If some columns already exist you may get "Duplicate column". Either:
--   • In phpMyAdmin: run each ALTER/CREATE block separately (skip any that error), or
--   • From command line: mysql ... --force < deploy_all_migrations.sql  (continues on error)
--
-- Order: 1) Campaign/AdFlow columns on ads
--        2) Dashboard columns on ads
--        3) Outdoor/display columns on ads
--        4) Beacon tables
-- ============================================================

-- ---------- 1) Campaign / AdFlow columns (Campaigns page) ----------
ALTER TABLE ads ADD COLUMN campaign VARCHAR(255) NULL;
ALTER TABLE ads ADD COLUMN adset VARCHAR(255) NULL;
ALTER TABLE ads ADD COLUMN platform VARCHAR(64) NULL;
ALTER TABLE ads ADD COLUMN format VARCHAR(64) NULL;
ALTER TABLE ads ADD COLUMN placement VARCHAR(128) NULL;
ALTER TABLE ads ADD COLUMN ad_type VARCHAR(64) NULL;
ALTER TABLE ads ADD COLUMN cta VARCHAR(64) NULL;
ALTER TABLE ads ADD COLUMN headline VARCHAR(500) NULL;
ALTER TABLE ads ADD COLUMN destination_url VARCHAR(1024) NULL;

-- ---------- 2) Dashboard columns on ads ----------
ALTER TABLE ads ADD COLUMN channel VARCHAR(32) DEFAULT 'social';
ALTER TABLE ads ADD COLUMN reach INT DEFAULT 0;
ALTER TABLE ads ADD COLUMN engagement DECIMAL(5,2) DEFAULT 0;
ALTER TABLE ads ADD COLUMN spend DECIMAL(12,2) DEFAULT 0;

-- ---------- 3) Outdoor / display columns on ads ----------
ALTER TABLE ads ADD COLUMN display_type VARCHAR(32) DEFAULT NULL;
ALTER TABLE ads ADD COLUMN location VARCHAR(255) DEFAULT NULL;
ALTER TABLE ads ADD COLUMN size VARCHAR(64) DEFAULT NULL;
ALTER TABLE ads ADD COLUMN period VARCHAR(64) DEFAULT NULL;
ALTER TABLE ads ADD COLUMN impressions_per_day INT DEFAULT NULL;
ALTER TABLE ads ADD COLUMN start_date DATE DEFAULT NULL;
ALTER TABLE ads ADD COLUMN end_date DATE DEFAULT NULL;

-- ---------- 4) Bluetooth Beacon tables ----------
CREATE TABLE IF NOT EXISTS beacons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  uuid VARCHAR(36) NOT NULL,
  major INT NULL DEFAULT 0,
  minor INT NULL DEFAULT 0,
  location_name VARCHAR(255) NULL,
  lat DECIMAL(10, 8) NULL,
  lng DECIMAL(11, 8) NULL,
  area VARCHAR(128) NULL,
  status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
  ad_id INT NULL,
  created_by INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_beacons_area (area),
  INDEX idx_beacons_status (status),
  INDEX idx_beacons_ad_id (ad_id),
  INDEX idx_beacons_uuid_major_minor (uuid, major, minor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS beacon_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  beacon_id INT NOT NULL,
  ad_id INT NULL,
  event_type ENUM('enter', 'exit', 'impression', 'click', 'dwell') NOT NULL,
  device_id VARCHAR(128) NULL,
  session_id VARCHAR(128) NULL,
  metadata TEXT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (beacon_id) REFERENCES beacons(id) ON DELETE CASCADE,
  FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE SET NULL,
  INDEX idx_beacon_events_beacon_id (beacon_id),
  INDEX idx_beacon_events_event_type (event_type),
  INDEX idx_beacon_events_created_at (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
