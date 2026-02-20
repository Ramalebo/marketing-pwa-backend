-- Add dashboard metrics columns to existing `ads` table (MySQL).
-- Run once in phpMyAdmin or MySQL client if your ads table was created before these columns existed.

ALTER TABLE `ads`
  ADD COLUMN `channel` varchar(32) DEFAULT 'social' AFTER `status`,
  ADD COLUMN `reach` int DEFAULT 0 AFTER `channel`,
  ADD COLUMN `engagement` decimal(5,2) DEFAULT 0 AFTER `reach`,
  ADD COLUMN `spend` decimal(12,2) DEFAULT 0 AFTER `engagement`;
