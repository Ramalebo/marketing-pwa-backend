const express = require('express');
const { PostHistory, Ad } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all post history
router.get('/', auth, async (req, res) => {
  try {
    const { platform, adId } = req.query;
    const where = { createdBy: req.user.id };
    
    if (platform) {
      where.platform = platform;
    }
    if (adId) {
      where.adId = adId;
    }

    const posts = await PostHistory.findAll({
      where,
      include: [{
        model: Ad,
        as: 'ad',
        attributes: ['id', 'title', 'description'],
        required: false
      }],
      order: [['publishedAt', 'DESC']]
    });
    
    res.json(posts.map(p => {
      const data = p.toJSON();
      return {
        ...data,
        id: data.id.toString(),
        adId: data.ad ? {
          _id: data.ad.id.toString(),
          title: data.ad.title,
          description: data.ad.description
        } : (data.adId ? data.adId.toString() : null),
        createdBy: data.createdBy.toString()
      };
    }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single post history
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await PostHistory.findOne({
      where: {
        id: req.params.id,
        createdBy: req.user.id
      },
      include: [{
        model: Ad,
        as: 'ad',
        attributes: ['id', 'title', 'description'],
        required: false
      }]
    });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const data = post.toJSON();
    res.json({
      ...data,
      id: data.id.toString(),
      adId: data.ad ? {
        _id: data.ad.id.toString(),
        title: data.ad.title,
        description: data.ad.description
      } : (data.adId ? data.adId.toString() : null),
      createdBy: data.createdBy.toString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create post history (called after successful posting)
router.post('/', auth, async (req, res) => {
  try {
    const post = await PostHistory.create({
      ...req.body,
      createdBy: req.user.id
    });
    
    await post.reload({
      include: [{
        model: Ad,
        as: 'ad',
        attributes: ['id', 'title', 'description']
      }]
    });
    
    const data = post.toJSON();
    res.status(201).json({
      ...data,
      id: data.id.toString(),
      adId: data.adId.toString(),
      createdBy: data.createdBy.toString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
