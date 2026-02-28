-- Bluetooth Beacon tables for proximity marketing
-- Run once on MySQL (e.g. cPanel phpMyAdmin or Render DB). Safe to run: uses CREATE TABLE IF NOT EXISTS.
-- Use your database name, e.g. USE marketing_pwa; or USE dominan1_marketing_pwa;

-- Beacons: physical BLE beacons (iBeacon UUID/major/minor), location, assigned ad
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

-- Beacon events: enter/exit/impression/click/dwell reported by client app
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
