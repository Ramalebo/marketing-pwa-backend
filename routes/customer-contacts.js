const express = require('express');
const { CustomerContact } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all customer contacts for a client
router.get('/', auth, async (req, res) => {
  try {
    const { clientId } = req.query;
    
    if (!clientId) {
      return res.status(400).json({ message: 'clientId is required' });
    }

    const contacts = await CustomerContact.findAll({
      where: { 
        clientId, 
        createdBy: req.user.id 
      },
      order: [['createdAt', 'DESC']]
    });
    
    res.json(contacts.map(c => {
      const data = c.toJSON();
      return {
        ...data,
        id: data.id.toString(),
        clientId: data.clientId.toString(),
        createdBy: data.createdBy.toString()
      };
    }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single customer contact
router.get('/:id', auth, async (req, res) => {
  try {
    const contact = await CustomerContact.findOne({
      where: {
        id: req.params.id,
        createdBy: req.user.id
      }
    });
    if (!contact) {
      return res.status(404).json({ message: 'Customer contact not found' });
    }
    const data = contact.toJSON();
    res.json({
      ...data,
      id: data.id.toString(),
      clientId: data.clientId.toString(),
      createdBy: data.createdBy.toString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create customer contact
router.post('/', auth, async (req, res) => {
  try {
    const contact = await CustomerContact.create({
      ...req.body,
      createdBy: req.user.id
    });
    const data = contact.toJSON();
    res.status(201).json({
      ...data,
      id: data.id.toString(),
      clientId: data.clientId.toString(),
      createdBy: data.createdBy.toString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk create customer contacts
router.post('/bulk', auth, async (req, res) => {
  try {
    const { clientId, contacts } = req.body;
    
    if (!clientId || !contacts || !Array.isArray(contacts)) {
      return res.status(400).json({ message: 'clientId and contacts array are required' });
    }

    const createdContacts = await CustomerContact.bulkCreate(
      contacts.map(contactData => ({
        ...contactData,
        clientId,
        createdBy: req.user.id
      }))
    );

    res.status(201).json({
      message: `Created ${createdContacts.length} customer contacts`,
      contacts: createdContacts.map(c => {
        const data = c.toJSON();
        return {
          ...data,
          id: data.id.toString(),
          clientId: data.clientId.toString(),
          createdBy: data.createdBy.toString()
        };
      })
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update customer contact
router.put('/:id', auth, async (req, res) => {
  try {
    const contact = await CustomerContact.findOne({
      where: { 
        id: req.params.id, 
        createdBy: req.user.id 
      }
    });
    if (!contact) {
      return res.status(404).json({ message: 'Customer contact not found' });
    }
    await contact.update(req.body);
    const data = contact.toJSON();
    res.json({
      ...data,
      id: data.id.toString(),
      clientId: data.clientId.toString(),
      createdBy: data.createdBy.toString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete customer contact
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await CustomerContact.findOne({
      where: {
        id: req.params.id,
        createdBy: req.user.id
      }
    });
    if (!contact) {
      return res.status(404).json({ message: 'Customer contact not found' });
    }
    await contact.destroy();
    res.json({ message: 'Customer contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
