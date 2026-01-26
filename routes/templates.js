const express = require('express');
const { Template } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all templates
router.get('/', auth, async (req, res) => {
  try {
    const { type } = req.query;
    const where = { createdBy: req.user.id };
    
    if (type) {
      where.type = type;
    }

    const templates = await Template.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
    res.json(templates.map(t => {
      const data = t.toJSON();
      return {
        ...data,
        id: data.id.toString(),
        createdBy: data.createdBy.toString()
      };
    }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single template
router.get('/:id', auth, async (req, res) => {
  try {
    const template = await Template.findOne({
      where: {
        id: req.params.id,
        createdBy: req.user.id
      }
    });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    const data = template.toJSON();
    res.json({
      ...data,
      id: data.id.toString(),
      createdBy: data.createdBy.toString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create template
router.post('/', auth, async (req, res) => {
  try {
    const template = await Template.create({
      ...req.body,
      createdBy: req.user.id
    });
    const data = template.toJSON();
    res.status(201).json({
      ...data,
      id: data.id.toString(),
      createdBy: data.createdBy.toString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update template
router.put('/:id', auth, async (req, res) => {
  try {
    const template = await Template.findOne({
      where: { 
        id: req.params.id, 
        createdBy: req.user.id 
      }
    });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    await template.update(req.body);
    const data = template.toJSON();
    res.json({
      ...data,
      id: data.id.toString(),
      createdBy: data.createdBy.toString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete template
router.delete('/:id', auth, async (req, res) => {
  try {
    const template = await Template.findOne({
      where: {
        id: req.params.id,
        createdBy: req.user.id
      }
    });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    await template.destroy();
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
