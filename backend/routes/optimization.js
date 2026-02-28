const express = require('express');
const { getRecommendations, advise } = require('../config/adBestPractices');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/optimization/recommendations
 * Query: platform (required), objective (optional), format (optional)
 * Returns industry best-practice specs and tips for the given platform.
 */
router.get('/recommendations', optionalAuth, (req, res) => {
  try {
    const platform = req.query.platform;
    if (!platform) {
      return res.status(400).json({ message: 'Query parameter "platform" is required.' });
    }
    const objective = req.query.objective || null;
    const format = req.query.format || null;
    const result = getRecommendations(platform, objective, format);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /api/optimization/advise
 * Body: { platform, headline?, description?, format? }
 * Returns recommendations plus compliance (over/ok) and optimization hints for current copy.
 */
router.post('/advise', optionalAuth, (req, res) => {
  try {
    const { platform, headline, description, format } = req.body || {};
    if (!platform) {
      return res.status(400).json({ message: 'Body "platform" is required.' });
    }
    const result = advise(platform, headline, description, format);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/optimization/platforms
 * Returns list of platforms that have best-practice rules (for dropdowns).
 */
router.get('/platforms', optionalAuth, (req, res) => {
  try {
    const { BEST_PRACTICES } = require('../config/adBestPractices');
    res.json({ platforms: Object.keys(BEST_PRACTICES) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
