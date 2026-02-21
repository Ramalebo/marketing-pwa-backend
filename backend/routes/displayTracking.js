/**
 * Display (OOH) tracking: fleet locations + impression tracking
 * - Fleet: taxi/car ads and delivery box ads (driver/vehicle location)
 * - Impressions: billboards and digital screens (tracked counts)
 */
const express = require('express');
const { Op } = require('sequelize');
const { Ad } = require('../models');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// In-memory stores (optional: replace with DB later)
const vehicleLocations = new Map(); // key: adId -> { lat, lng, updatedAt }
const impressionCounts = new Map(); // key: adId -> { total, daily: { 'YYYY-MM-DD': count } }

// GET /api/display/vehicles – list fleet (taxi + delivery) with current locations
router.get('/vehicles', optionalAuth, async (req, res) => {
  try {
    const ads = await Ad.findAll({
      where: {
        channel: 'display',
        displayType: { [Op.in]: ['taxi', 'delivery'] }
      },
      attributes: ['id', 'title', 'displayType', 'location', 'status']
    });

    const baseLat = -26.2041;
    const baseLng = 28.0473;
    const vehicles = ads.map((ad, i) => {
      const stored = vehicleLocations.get(ad.id);
      const lat = stored?.lat ?? baseLat + (i * 0.01) + (Math.random() * 0.008);
      const lng = stored?.lng ?? baseLng + (i * 0.01) + (Math.random() * 0.008);
      return {
        id: `v-${ad.id}`,
        adId: ad.id,
        name: ad.title || `Vehicle ${ad.id}`,
        displayType: ad.displayType || 'taxi',
        lat,
        lng,
        location: ad.location,
        status: ad.status,
        updatedAt: stored?.updatedAt || new Date().toISOString()
      };
    });

    res.json(vehicles);
  } catch (e) {
    console.error('GET /display/vehicles', e);
    res.status(500).json({ message: 'Failed to load fleet' });
  }
});

// POST /api/display/vehicles/location – update vehicle location (e.g. from driver app)
router.post('/vehicles/location', optionalAuth, async (req, res) => {
  try {
    const { adId, lat, lng } = req.body || {};
    if (adId == null || lat == null || lng == null) {
      return res.status(400).json({ message: 'adId, lat, lng required' });
    }
    vehicleLocations.set(Number(adId), {
      lat: Number(lat),
      lng: Number(lng),
      updatedAt: new Date().toISOString()
    });
    res.json({ ok: true });
  } catch (e) {
    console.error('POST /display/vehicles/location', e);
    res.status(500).json({ message: 'Failed to update location' });
  }
});

// GET /api/display/impressions – impression summary for billboards & digital screens
router.get('/impressions', optionalAuth, async (req, res) => {
  try {
    const ads = await Ad.findAll({
      where: {
        channel: 'display',
        displayType: { [Op.in]: ['billboard', 'digital'] }
      },
      attributes: ['id', 'title', 'displayType', 'location', 'impressionsPerDay', 'status']
    });

    const today = new Date().toISOString().slice(0, 10);
    const out = ads.map((ad) => {
      const stored = impressionCounts.get(ad.id) || { total: 0, daily: {} };
      const dailyRecorded = stored.daily[today] || 0;
      const estimatedPerDay = Number(ad.impressionsPerDay) || 0;
      return {
        adId: ad.id,
        title: ad.title,
        displayType: ad.displayType,
        location: ad.location,
        status: ad.status,
        impressionsPerDay: estimatedPerDay,
        recordedToday: dailyRecorded,
        recordedTotal: stored.total,
        estimatedTotal: stored.total + (estimatedPerDay * 7) // rough 7-day view
      };
    });

    res.json(out);
  } catch (e) {
    console.error('GET /display/impressions', e);
    res.status(500).json({ message: 'Failed to load impressions' });
  }
});

// POST /api/display/impressions – record impression(s) for an ad (e.g. from sensor)
router.post('/impressions', optionalAuth, async (req, res) => {
  try {
    const { adId, count = 1 } = req.body || {};
    if (adId == null) {
      return res.status(400).json({ message: 'adId required' });
    }
    const id = Number(adId);
    const c = Number(count) || 1;
    const existing = impressionCounts.get(id) || { total: 0, daily: {} };
    const today = new Date().toISOString().slice(0, 10);
    existing.total += c;
    existing.daily[today] = (existing.daily[today] || 0) + c;
    impressionCounts.set(id, existing);
    res.json({ ok: true, recorded: c, total: existing.total });
  } catch (e) {
    console.error('POST /display/impressions', e);
    res.status(500).json({ message: 'Failed to record impression' });
  }
});

module.exports = router;
