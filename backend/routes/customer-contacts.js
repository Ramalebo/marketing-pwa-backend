const express = require('express');
const { CustomerContact } = require('../models');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all customer contacts for a client
router.get('/', optionalAuth, async (req, res) => {
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
router.get('/:id', optionalAuth, async (req, res) => {
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
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { name, email, phoneNumber, notes, clientId } = req.body;
    const contact = await CustomerContact.create({
      name: (name && String(name).trim()) || email || 'Contact',
      email: email,
      phoneNumber: (phoneNumber && String(phoneNumber).trim()) || '',
      notes: notes || null,
      clientId: clientId,
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
router.post('/bulk', optionalAuth, async (req, res) => {
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
router.put('/:id', optionalAuth, async (req, res) => {
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
    const updates = {};
    if (req.body.name !== undefined) updates.name = (req.body.name && String(req.body.name).trim()) || contact.email || 'Contact';
    if (req.body.email !== undefined) updates.email = req.body.email;
    if (req.body.phoneNumber !== undefined) updates.phoneNumber = (req.body.phoneNumber && String(req.body.phoneNumber).trim()) || '';
    if (req.body.notes !== undefined) updates.notes = req.body.notes;
    await contact.update(updates);
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
router.delete('/:id', optionalAuth, async (req, res) => {
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
