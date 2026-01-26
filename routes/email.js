const express = require('express');
const nodemailer = require('nodemailer');
const { Client, CustomerContact } = require('../models');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Create transporter if email credentials are available
const getTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email to client or customer contacts
router.post('/send', auth, async (req, res) => {
  try {
    const transporter = getTransporter();
    if (!transporter) {
      return res.status(500).json({ message: 'Email credentials not configured' });
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
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: contact.email,
            subject: subject || 'Message from Marketing Platform',
            text: text || html,
            html: html
          };

          const info = await transporter.sendMail(mailOptions);
          results.push({
            contactId: contact.id.toString(),
            contactName: contact.name || contact.email,
            success: true,
            messageId: info.messageId
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

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: clientData.email,
      subject: subject || 'Message from Marketing Platform',
      text: text || html,
      html: html
    };

    const info = await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      messageId: info.messageId,
      response: info.response
    });
  } catch (error) {
    console.error('Email Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Send bulk email to customer contacts
router.post('/send-bulk', auth, async (req, res) => {
  try {
    const transporter = getTransporter();
    if (!transporter) {
      return res.status(500).json({ message: 'Email credentials not configured' });
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

    const results = [];

    for (const contact of contacts) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: contact.email,
          subject: subject || 'Message from Marketing Platform',
          text: text || html,
          html: html
        };

        const info = await transporter.sendMail(mailOptions);

        results.push({
          contactId: contact.id.toString(),
          contactName: contact.name || contact.email,
          email: contact.email,
          success: true,
          messageId: info.messageId
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
