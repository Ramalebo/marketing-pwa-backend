const express = require('express');
const twilio = require('twilio');
const { Client, CustomerContact } = require('../models');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Initialize Twilio client if credentials are available
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

// Send SMS to client or customer contacts
router.post('/send', auth, async (req, res) => {
  try {
    if (!twilioClient) {
      return res.status(500).json({ message: 'Twilio credentials not configured' });
    }

    const { clientId, message, contactIds } = req.body;

    const clientData = await Client.findOne({
      where: { 
        id: clientId, 
        createdBy: req.user.id 
      }
    });
    if (!clientData) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // If contactIds provided, send to customer contacts
    if (contactIds && contactIds.length > 0) {
      const contacts = await CustomerContact.findAll({
        where: {
          id: { [Op.in]: contactIds },
          clientId: clientId,
          createdBy: req.user.id,
          phoneNumber: { [Op.ne]: null }
        }
      });

      if (contacts.length === 0) {
        return res.status(400).json({ message: 'No valid customer contacts found' });
      }

      const results = [];
      for (const contact of contacts) {
        try {
          const twilioMessage = await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: contact.phoneNumber
          });

          results.push({
            contactId: contact.id.toString(),
            contactName: contact.name || contact.phoneNumber,
            success: true,
            messageId: twilioMessage.sid
          });
        } catch (error) {
          results.push({
            contactId: contact.id.toString(),
            contactName: contact.name || contact.phoneNumber,
            success: false,
            error: error.message
          });
        }
      }

      return res.json({
        success: true,
        sent: results.filter(r => r.success).length,
        total: results.length,
        results
      });
    }

    // Otherwise send to client's phone
    if (!clientData.phoneNumber) {
      return res.status(400).json({ message: 'Client does not have a phone number' });
    }

    const twilioMessage = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: clientData.phoneNumber
    });

    res.json({
      success: true,
      messageId: twilioMessage.sid,
      status: twilioMessage.status
    });
  } catch (error) {
    console.error('SMS Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Send bulk SMS to customer contacts
router.post('/send-bulk', auth, async (req, res) => {
  try {
    if (!twilioClient) {
      return res.status(500).json({ message: 'Twilio credentials not configured' });
    }

    const { clientId, message, contactIds } = req.body;

    if (!clientId) {
      return res.status(400).json({ message: 'clientId is required' });
    }

    const clientData = await Client.findOne({
      where: { 
        id: clientId, 
        createdBy: req.user.id 
      }
    });
    if (!clientData) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Get customer contacts for this client
    const where = {
      clientId: clientId,
      createdBy: req.user.id,
      phoneNumber: { [Op.ne]: null }
    };

    if (contactIds && contactIds.length > 0) {
      where.id = { [Op.in]: contactIds };
    }

    const contacts = await CustomerContact.findAll({ where });

    if (contacts.length === 0) {
      return res.status(400).json({ message: 'No customer contacts found for this client' });
    }

    const results = [];

    for (const contact of contacts) {
      try {
        const twilioMessage = await twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: contact.phoneNumber
        });

        results.push({
          contactId: contact.id.toString(),
          contactName: contact.name || contact.phoneNumber,
          phoneNumber: contact.phoneNumber,
          success: true,
          messageId: twilioMessage.sid
        });
      } catch (error) {
        results.push({
          contactId: contact.id.toString(),
          contactName: contact.name || contact.phoneNumber,
          phoneNumber: contact.phoneNumber,
          success: false,
          error: error.message
        });
      }
    }

    res.json({
      total: contacts.length,
      sent: results.filter(r => r.success).length,
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
