const express = require('express');
const { ScheduledPost, Ad, PostHistory } = require('../models');
const { optionalAuth } = require('../middleware/auth');
const { postToFacebook, postToInstagram, sendWhatsApp } = require('../services/socialPublish');

const router = express.Router();

function toResponse(row) {
  const d = row.toJSON ? row.toJSON() : row;
  return {
    ...d,
    id: d.id.toString(),
    adId: d.adId?.toString?.() ?? d.ad_id,
    createdBy: d.createdBy?.toString?.() ?? d.created_by
  };
}

// List scheduled posts
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { status, platform, adId } = req.query;
    const where = { createdBy: req.user.id };
    if (status) where.status = status;
    if (platform) where.platform = platform;
    if (adId) where.adId = adId;

    const list = await ScheduledPost.findAll({
      where,
      include: [{ model: Ad, as: 'ad', attributes: ['id', 'title', 'description', 'contentImages', 'contentText'] }],
      order: [['scheduledAt', 'ASC']]
    });
    res.json(list.map(toResponse));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create scheduled post(s) – one per platform
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { adId, platforms, scheduledAt, message, whatsappPhone } = req.body;
    if (!adId || !platforms || !Array.isArray(platforms) || platforms.length === 0 || !scheduledAt) {
      return res.status(400).json({ message: 'adId, platforms (array), and scheduledAt are required' });
    }
    const at = new Date(scheduledAt);
    if (isNaN(at.getTime())) return res.status(400).json({ message: 'Invalid scheduledAt date' });
    if (at <= new Date()) return res.status(400).json({ message: 'scheduledAt must be in the future' });

    const ad = await Ad.findOne({ where: { id: adId, createdBy: req.user.id } });
    if (!ad) return res.status(404).json({ message: 'Ad not found' });

    const created = [];
    for (const platform of platforms) {
      if (!['facebook', 'instagram', 'whatsapp'].includes(platform)) continue;
      const row = await ScheduledPost.create({
        adId: ad.id,
        platform,
        scheduledAt: at,
        status: 'scheduled',
        message: message || null,
        whatsappPhone: platform === 'whatsapp' ? (whatsappPhone || null) : null,
        createdBy: req.user.id
      });
      await row.reload({ include: [{ model: Ad, as: 'ad', attributes: ['id', 'title', 'description'] }] });
      created.push(toResponse(row));
    }
    if (created.length === 0) return res.status(400).json({ message: 'No valid platforms' });
    res.status(201).json(created.length === 1 ? created[0] : created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update one (reschedule or cancel)
router.patch('/:id', optionalAuth, async (req, res) => {
  try {
    const row = await ScheduledPost.findOne({ where: { id: req.params.id, createdBy: req.user.id } });
    if (!row) return res.status(404).json({ message: 'Scheduled post not found' });
    if (row.status !== 'scheduled') return res.status(400).json({ message: 'Only scheduled posts can be updated' });

    const { scheduledAt, status } = req.body;
    if (scheduledAt !== undefined) {
      const at = new Date(scheduledAt);
      if (isNaN(at.getTime()) || at <= new Date()) return res.status(400).json({ message: 'scheduledAt must be a future date' });
      row.scheduledAt = at;
    }
    if (status === 'cancelled') row.status = 'cancelled';
    await row.save();
    await row.reload({ include: [{ model: Ad, as: 'ad', attributes: ['id', 'title', 'description'] }] });
    res.json(toResponse(row));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete one
router.delete('/:id', optionalAuth, async (req, res) => {
  try {
    const row = await ScheduledPost.findOne({ where: { id: req.params.id, createdBy: req.user.id } });
    if (!row) return res.status(404).json({ message: 'Scheduled post not found' });
    await row.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Process due scheduled posts (call from cron or manually)
router.post('/process-due', optionalAuth, async (req, res) => {
  try {
    const due = await ScheduledPost.findAll({
      where: { status: 'scheduled' },
      include: [{ model: Ad, as: 'ad', attributes: ['id', 'title', 'description', 'contentImages', 'contentText'] }],
      order: [['scheduledAt', 'ASC']]
    });
    const now = new Date();
    const toProcess = due.filter(s => new Date(s.scheduledAt) <= now);
    const results = [];

    for (const s of toProcess) {
      const ad = s.ad;
      if (!ad) {
        await s.update({ status: 'failed', error: 'Ad not found' });
        results.push({ id: s.id, success: false, error: 'Ad not found' });
        continue;
      }
      const adData = ad.toJSON ? ad.toJSON() : ad;
      const imageUrl = (adData.contentImages && adData.contentImages[0]) || null;
      const message = s.message || adData.description || adData.contentText || '';

      try {
        if (s.platform === 'facebook') {
          const result = await postToFacebook(ad, imageUrl, message);
          await PostHistory.create({ adId: ad.id, platform: 'facebook', postId: result.postId, status: 'success', message: 'Posted (scheduled)', publishedAt: new Date(), createdBy: s.createdBy });
          await s.update({ status: 'published', publishedAt: new Date() });
          results.push({ id: s.id, success: true, postId: result.postId });
        } else if (s.platform === 'instagram') {
          const result = await postToInstagram(ad, imageUrl, message);
          await PostHistory.create({ adId: ad.id, platform: 'instagram', postId: result.postId, status: 'success', message: 'Posted (scheduled)', publishedAt: new Date(), createdBy: s.createdBy });
          await s.update({ status: 'published', publishedAt: new Date() });
          results.push({ id: s.id, success: true, postId: result.postId });
        } else if (s.platform === 'whatsapp') {
          const phone = s.whatsappPhone;
          if (!phone) {
            await s.update({ status: 'failed', error: 'WhatsApp phone required' });
            results.push({ id: s.id, success: false, error: 'WhatsApp phone required' });
            continue;
          }
          const result = await sendWhatsApp(ad, phone, message);
          await PostHistory.create({ adId: ad.id, platform: 'whatsapp', postId: result.messageId, status: 'success', message: 'Sent (scheduled)', publishedAt: new Date(), createdBy: s.createdBy });
          await s.update({ status: 'published', publishedAt: new Date() });
          results.push({ id: s.id, success: true, messageId: result.messageId });
        }
      } catch (err) {
        const errMsg = err.response?.data?.error?.message || err.message;
        await s.update({ status: 'failed', error: errMsg });
        results.push({ id: s.id, success: false, error: errMsg });
      }
    }

    res.json({ processed: toProcess.length, results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
