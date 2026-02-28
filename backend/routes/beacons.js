/**
 * Bluetooth beacon management and proximity marketing
 * - CRUD beacons, assign ad to beacon
 * - Public/client: get content for beacon, report event (enter/exit/impression/click)
 * - Dashboard: list by area, performance stats
 */
const express = require('express');
const { Op } = require('sequelize');
const { Beacon, BeaconEvent, Ad } = require('../models');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// ---------- Dashboard/management (optionalAuth) ----------

// GET /api/beacons – list all beacons (optional filter by area, status)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { area, status } = req.query;
    const where = {};
    if (area) where.area = area;
    if (status) where.status = status;
    const beacons = await Beacon.findAll({
      where,
      include: [{ model: Ad, as: 'ad', attributes: ['id', 'title', 'headline', 'destinationUrl', 'status'] }],
      order: [['area', 'ASC'], ['name', 'ASC']]
    });
    res.json(beacons);
  } catch (e) {
    console.error('GET /beacons', e);
    res.status(500).json({ message: 'Failed to load beacons' });
  }
});

// GET /api/beacons/areas – distinct areas for filters
router.get('/areas', optionalAuth, async (req, res) => {
  try {
    const rows = await Beacon.findAll({ attributes: ['area'], raw: true });
    const areas = [...new Set(rows.map(r => r.area).filter(Boolean))].sort();
    res.json(areas);
  } catch (e) {
    console.error('GET /beacons/areas', e);
    res.status(500).json({ message: 'Failed to load areas' });
  }
});

// GET /api/beacons/performance – aggregate by beacon and by area
router.get('/performance', optionalAuth, async (req, res) => {
  try {
    const { area, from, to } = req.query;
    const where = {};
    if (area) where.area = area;
    const beacons = await Beacon.findAll({ where, attributes: ['id', 'name', 'area', 'locationName', 'status', 'adId'] });
    const beaconIds = beacons.map(b => b.id);
    if (beaconIds.length === 0) {
      return res.json({ byBeacon: [], byArea: [] });
    }
    const eventWhere = { beaconId: { [Op.in]: beaconIds } };
    if (from || to) {
      eventWhere.createdAt = {};
      if (from) eventWhere.createdAt[Op.gte] = new Date(from);
      if (to) eventWhere.createdAt[Op.lte] = new Date(to);
    }
    const events = await BeaconEvent.findAll({
      where: eventWhere,
      attributes: ['beaconId', 'eventType', 'id'],
      raw: true
    });
    const byBeacon = {};
    beacons.forEach(b => {
      byBeacon[b.id] = {
        beaconId: b.id,
        name: b.name,
        area: b.area,
        locationName: b.locationName,
        status: b.status,
        adId: b.adId,
        impressions: 0,
        enters: 0,
        exits: 0,
        clicks: 0,
        dwells: 0,
        uniqueDevices: new Set()
      };
    });
    events.forEach(ev => {
      if (!byBeacon[ev.beaconId]) return;
      const s = byBeacon[ev.beaconId];
      if (ev.eventType === 'impression') s.impressions++;
      else if (ev.eventType === 'enter') s.enters++;
      else if (ev.eventType === 'exit') s.exits++;
      else if (ev.eventType === 'click') s.clicks++;
      else if (ev.eventType === 'dwell') s.dwells++;
    });
    const byBeaconList = Object.values(byBeacon).map(s => ({
      ...s,
      uniqueDevices: undefined
    }));
    const byAreaMap = {};
    byBeaconList.forEach(s => {
      const key = s.area || 'Unassigned';
      if (!byAreaMap[key]) byAreaMap[key] = { area: key, beacons: 0, impressions: 0, enters: 0, clicks: 0 };
      byAreaMap[key].beacons++;
      byAreaMap[key].impressions += s.impressions;
      byAreaMap[key].enters += s.enters;
      byAreaMap[key].clicks += s.clicks;
    });
    res.json({ byBeacon: byBeaconList, byArea: Object.values(byAreaMap) });
  } catch (e) {
    console.error('GET /beacons/performance', e);
    res.status(500).json({ message: 'Failed to load performance' });
  }
});

// GET /api/beacons/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const beacon = await Beacon.findByPk(req.params.id, {
      include: [{ model: Ad, as: 'ad', attributes: ['id', 'title', 'headline', 'destinationUrl', 'contentText', 'contentImages', 'status'] }]
    });
    if (!beacon) return res.status(404).json({ message: 'Beacon not found' });
    res.json(beacon);
  } catch (e) {
    console.error('GET /beacons/:id', e);
    res.status(500).json({ message: 'Failed to load beacon' });
  }
});

// POST /api/beacons
router.post('/', optionalAuth, async (req, res) => {
  try {
    const user = req.user;
    const { name, uuid, major, minor, locationName, lat, lng, area, status, adId } = req.body || {};
    if (!name || !uuid) return res.status(400).json({ message: 'name and uuid are required' });
    const beacon = await Beacon.create({
      name,
      uuid: String(uuid).trim(),
      major: major != null ? Number(major) : 0,
      minor: minor != null ? Number(minor) : 0,
      locationName: locationName || null,
      lat: lat != null ? Number(lat) : null,
      lng: lng != null ? Number(lng) : null,
      area: area || null,
      status: status || 'active',
      adId: adId != null ? Number(adId) : null,
      createdBy: user.id
    });
    res.status(201).json(beacon);
  } catch (e) {
    console.error('POST /beacons', e);
    res.status(500).json({ message: 'Failed to create beacon' });
  }
});

// PUT /api/beacons/:id
router.put('/:id', optionalAuth, async (req, res) => {
  try {
    const beacon = await Beacon.findByPk(req.params.id);
    if (!beacon) return res.status(404).json({ message: 'Beacon not found' });
    const { name, uuid, major, minor, locationName, lat, lng, area, status, adId } = req.body || {};
    if (name != null) beacon.name = name;
    if (uuid != null) beacon.uuid = String(uuid).trim();
    if (major != null) beacon.major = Number(major);
    if (minor != null) beacon.minor = Number(minor);
    if (locationName !== undefined) beacon.locationName = locationName || null;
    if (lat !== undefined) beacon.lat = lat != null ? Number(lat) : null;
    if (lng !== undefined) beacon.lng = lng != null ? Number(lng) : null;
    if (area !== undefined) beacon.area = area || null;
    if (status != null) beacon.status = status;
    if (adId !== undefined) beacon.adId = adId != null ? Number(adId) : null;
    await beacon.save();
    res.json(beacon);
  } catch (e) {
    console.error('PUT /beacons/:id', e);
    res.status(500).json({ message: 'Failed to update beacon' });
  }
});

// DELETE /api/beacons/:id
router.delete('/:id', optionalAuth, async (req, res) => {
  try {
    const beacon = await Beacon.findByPk(req.params.id);
    if (!beacon) return res.status(404).json({ message: 'Beacon not found' });
    await BeaconEvent.destroy({ where: { beaconId: beacon.id } });
    await beacon.destroy();
    res.json({ ok: true });
  } catch (e) {
    console.error('DELETE /beacons/:id', e);
    res.status(500).json({ message: 'Failed to delete beacon' });
  }
});

// ---------- Client app (no auth required for proximity app) ----------

// GET /api/beacons/content/:uuid/:major?/:minor? – resolve beacon by identifier and return ad content to show
router.get('/content/:uuid/:major?/:minor?', async (req, res) => {
  try {
    const uuid = (req.params.uuid || '').trim();
    const major = req.params.major != null ? parseInt(req.params.major, 10) : 0;
    const minor = req.params.minor != null ? parseInt(req.params.minor, 10) : 0;
    const beacon = await Beacon.findOne({
      where: { uuid, major: major || 0, minor: minor || 0, status: 'active' },
      include: [{ model: Ad, as: 'ad', attributes: ['id', 'title', 'headline', 'description', 'destinationUrl', 'contentText', 'contentImages', 'cta', 'status'] }]
    });
    if (!beacon) return res.status(404).json({ message: 'Beacon not found or inactive' });
    const ad = beacon.ad;
    if (!ad || ad.status !== 'published') {
      return res.json({ beaconId: beacon.id, name: beacon.name, locationName: beacon.locationName, ad: null });
    }
    res.json({
      beaconId: beacon.id,
      name: beacon.name,
      locationName: beacon.locationName,
      ad: {
        id: ad.id,
        title: ad.title,
        headline: ad.headline,
        description: ad.description,
        destinationUrl: ad.destinationUrl,
        contentText: ad.contentText,
        contentImages: ad.contentImages || [],
        cta: ad.cta
      }
    });
  } catch (e) {
    console.error('GET /beacons/content/:uuid', e);
    res.status(500).json({ message: 'Failed to get content' });
  }
});

// POST /api/beacons/event – client app reports enter/exit/impression/click/dwell
router.post('/event', express.json(), async (req, res) => {
  try {
    const { beaconId, uuid, major, minor, eventType, deviceId, sessionId, adId, metadata } = req.body || {};
    let bid = beaconId;
    if (bid == null && uuid) {
      const majorNum = major != null ? parseInt(major, 10) : 0;
      const minorNum = minor != null ? parseInt(minor, 10) : 0;
      const b = await Beacon.findOne({ where: { uuid: String(uuid).trim(), major: majorNum, minor: minorNum } });
      if (b) bid = b.id;
    }
    if (bid == null) return res.status(400).json({ message: 'beaconId or uuid (with major/minor) required' });
    const allowed = ['enter', 'exit', 'impression', 'click', 'dwell'];
    if (!eventType || !allowed.includes(eventType)) return res.status(400).json({ message: 'eventType must be one of: ' + allowed.join(', ') });
    const beacon = await Beacon.findByPk(bid);
    if (!beacon) return res.status(404).json({ message: 'Beacon not found' });
    const event = await BeaconEvent.create({
      beaconId: beacon.id,
      adId: adId != null ? Number(adId) : beacon.adId,
      eventType,
      deviceId: deviceId || null,
      sessionId: sessionId || null,
      metadata: metadata || null
    });
    res.status(201).json({ id: event.id, ok: true });
  } catch (e) {
    console.error('POST /beacons/event', e);
    res.status(500).json({ message: 'Failed to record event' });
  }
});

module.exports = router;
