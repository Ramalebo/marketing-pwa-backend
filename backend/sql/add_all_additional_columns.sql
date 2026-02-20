-- ============================================================
-- Add ALL additional columns to existing `ads` table (MySQL)
-- ============================================================
-- Run this ONCE in phpMyAdmin or MySQL client if your ads table
-- was created before these columns existed.
--
-- Includes: dashboard (channel, reach, engagement, spend) and
--           outdoor (display_type, location, size, period,
--           impressions_per_day, start_date, end_date).
--
-- If you get "Duplicate column name" errors, you already have
-- some columns. Run add_dashboard_columns.sql then
-- add_outdoor_columns.sql separately, or add only the missing
-- columns manually.
-- ============================================================

ALTER TABLE `ads`
  ADD COLUMN `channel` varchar(32) DEFAULT 'social' AFTER `status`,
  ADD COLUMN `reach` int DEFAULT 0 AFTER `channel`,
  ADD COLUMN `engagement` decimal(5,2) DEFAULT 0 AFTER `reach`,
  ADD COLUMN `spend` decimal(12,2) DEFAULT 0 AFTER `engagement`,
  ADD COLUMN `display_type` varchar(32) DEFAULT NULL AFTER `spend`,
  ADD COLUMN `location` varchar(255) DEFAULT NULL AFTER `display_type`,
  ADD COLUMN `size` varchar(64) DEFAULT NULL AFTER `location`,
  ADD COLUMN `period` varchar(64) DEFAULT NULL AFTER `size`,
  ADD COLUMN `impressions_per_day` int DEFAULT NULL AFTER `period`,
  ADD COLUMN `start_date` date DEFAULT NULL AFTER `impressions_per_day`,
  ADD COLUMN `end_date` date DEFAULT NULL AFTER `start_date`;
