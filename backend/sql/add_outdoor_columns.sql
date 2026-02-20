-- Add outdoor/display ad columns to existing `ads` table (MySQL).
-- Run after add_dashboard_columns.sql if you use outdoor advertising features.

ALTER TABLE `ads`
  ADD COLUMN `display_type` varchar(32) DEFAULT NULL AFTER `spend`,
  ADD COLUMN `location` varchar(255) DEFAULT NULL AFTER `display_type`,
  ADD COLUMN `size` varchar(64) DEFAULT NULL AFTER `location`,
  ADD COLUMN `period` varchar(64) DEFAULT NULL AFTER `size`,
  ADD COLUMN `impressions_per_day` int DEFAULT NULL AFTER `period`,
  ADD COLUMN `start_date` date DEFAULT NULL AFTER `impressions_per_day`,
  ADD COLUMN `end_date` date DEFAULT NULL AFTER `start_date`;
