const express = require('express');
const { MailtrapClient } = require('mailtrap');
const { Client, CustomerContact } = require('../models');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Initialize Mailtrap client if API token is available
const getMailtrapClient = () => {
  if (!process.env.MAILTRAP_API_TOKEN) {
    return null;
  }
  return new MailtrapClient({
    token: process.env.MAILTRAP_API_TOKEN
  });
};

// Send email to client or customer contacts
router.post('/send', auth, async (req, res) => {
  try {
    const mailtrap = getMailtrapClient();
    if (!mailtrap) {
      return res.status(500).json({ message: 'Mailtrap API token not configured' });
    }

    const { clientId, subject, html, text, contactIds } = req.body;

    const clientData = await Client.findOne({
      where: { 
        id: clientId, 
        createdBy: req.user.id 
      }
    });
    if (!clientData) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Get sender email from environment or use default
    const senderEmail = process.env.MAILTRAP_SENDER_EMAIL || 'noreply@dominantlogic.tech';
    const senderName = process.env.MAILTRAP_SENDER_NAME || 'Marketing Platform';

    // If contactIds provided, send to customer contacts
    if (contactIds && contactIds.length > 0) {
      const contacts = await CustomerContact.findAll({
        where: {
          id: { [Op.in]: contactIds },
          clientId: clientId,
          createdBy: req.user.id,
          email: { [Op.ne]: null }
        }
      });

      if (contacts.length === 0) {
        return res.status(400).json({ message: 'No valid customer contacts found' });
      }

      const results = [];
      for (const contact of contacts) {
        try {
          const response = await mailtrap.send({
            from: { name: senderName, email: senderEmail },
            to: [{ email: contact.email }],
            subject: subject || 'Message from Marketing Platform',
            text: text || html,
            html: html
          });

          results.push({
            contactId: contact.id.toString(),
            contactName: contact.name || contact.email,
            success: true,
            messageId: response.message_ids?.[0] || 'sent'
          });
        } catch (error) {
          results.push({
            contactId: contact.id.toString(),
            contactName: contact.name || contact.email,
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

    // Otherwise send to client's email
    if (!clientData.email) {
      return res.status(400).json({ message: 'Client does not have an email address' });
    }

    const response = await mailtrap.send({
      from: { name: senderName, email: senderEmail },
      to: [{ email: clientData.email }],
      subject: subject || 'Message from Marketing Platform',
      text: text || html,
      html: html
    });

    res.json({
      success: true,
      messageId: response.message_ids?.[0] || 'sent',
      response: 'Email sent successfully'
    });
  } catch (error) {
    console.error('Email Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Send bulk email to customer contacts
router.post('/send-bulk', auth, async (req, res) => {
  try {
    const mailtrap = getMailtrapClient();
    if (!mailtrap) {
      return res.status(500).json({ message: 'Mailtrap API token not configured' });
    }

    const { clientId, subject, html, text, contactIds } = req.body;

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
      email: { [Op.ne]: null }
    };

    if (contactIds && contactIds.length > 0) {
      where.id = { [Op.in]: contactIds };
    }

    const contacts = await CustomerContact.findAll({ where });

    if (contacts.length === 0) {
      return res.status(400).json({ message: 'No customer contacts found for this client' });
    }

    // Get sender email from environment or use default
    const senderEmail = process.env.MAILTRAP_SENDER_EMAIL || 'noreply@dominantlogic.tech';
    const senderName = process.env.MAILTRAP_SENDER_NAME || 'Marketing Platform';

    const results = [];

    for (const contact of contacts) {
      try {
        const response = await mailtrap.send({
          from: { name: senderName, email: senderEmail },
          to: [{ email: contact.email }],
          subject: subject || 'Message from Marketing Platform',
          text: text || html,
          html: html
        });

        results.push({
          contactId: contact.id.toString(),
          contactName: contact.name || contact.email,
          email: contact.email,
          success: true,
          messageId: response.message_ids?.[0] || 'sent'
        });
      } catch (error) {
        results.push({
          contactId: contact.id.toString(),
          contactName: contact.name || contact.email,
          email: contact.email,
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
