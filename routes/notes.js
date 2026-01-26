const express = require('express');
const { Note, Client } = require('../models');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get all notes
router.get('/', auth, async (req, res) => {
  try {
    const { clientId, category } = req.query;
    const where = { createdBy: req.user.id };
    
    if (clientId) where.clientId = clientId;
    if (category) where.category = category;

    const notes = await Note.findAll({
      where,
      include: [{
        model: Client,
        as: 'client',
        attributes: ['id', 'name', 'businessName'],
        required: false
      }],
      order: [['createdAt', 'DESC']]
    });
    
    const formattedNotes = notes.map(note => {
      const data = note.toJSON();
      return {
        ...data,
        id: data.id.toString(),
        clientId: data.client ? {
          _id: data.client.id.toString(),
          name: data.client.name,
          businessName: data.client.businessName
        } : (data.clientId ? data.clientId.toString() : null),
        createdBy: data.createdBy.toString()
      };
    });
    
    res.json(formattedNotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single note
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({
      where: { 
        id: req.params.id, 
        createdBy: req.user.id 
      },
      include: [{
        model: Client,
        as: 'client',
        attributes: ['id', 'name', 'businessName'],
        required: false
      }]
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    const data = note.toJSON();
    res.json({
      ...data,
      id: data.id.toString(),
      clientId: data.client ? {
        _id: data.client.id.toString(),
        name: data.client.name,
        businessName: data.client.businessName
      } : (data.clientId ? data.clientId.toString() : null),
      createdBy: data.createdBy.toString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create note
router.post('/', auth, async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body,
      createdBy: req.user.id
    });
    
    if (note.clientId) {
      await note.reload({
        include: [{
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'businessName']
        }]
      });
    }
    
    const data = note.toJSON();
    res.status(201).json({
      ...data,
      id: data.id.toString(),
      clientId: data.clientId ? data.clientId.toString() : null,
      createdBy: data.createdBy.toString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update note
router.put('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({
      where: { 
        id: req.params.id, 
        createdBy: req.user.id 
      }
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    await note.update(req.body);
    
    if (note.clientId) {
      await note.reload({
        include: [{
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'businessName']
        }]
      });
    }
    
    const data = note.toJSON();
    res.json({
      ...data,
      id: data.id.toString(),
      clientId: data.clientId ? data.clientId.toString() : null,
      createdBy: data.createdBy.toString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({
      where: { 
        id: req.params.id, 
        createdBy: req.user.id 
      }
    });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    await note.destroy();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get AI-relevant notes for a client
router.get('/ai/:clientId', auth, async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: {
        clientId: req.params.clientId,
        createdBy: req.user.id,
        aiRelevant: true
      },
      order: [
        ['priority', 'DESC'],
        ['createdAt', 'DESC']
      ]
    });
    
    res.json(notes.map(note => {
      const data = note.toJSON();
      return {
        ...data,
        id: data.id.toString(),
        clientId: data.clientId ? data.clientId.toString() : null,
        createdBy: data.createdBy.toString()
      };
    }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
