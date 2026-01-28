const express = require('express');
const axios = require('axios');
const { Client, CustomerContact } = require('../models');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// SMSProvider API configuration
const SMS_PROVIDER_API_URL = 'https://customer.smsprovider.com.ng/api/';
const smsProviderConfigured = process.env.SMS_PROVIDER_USERNAME && process.env.SMS_PROVIDER_PASSWORD && process.env.SMS_PROVIDER_SENDER;

// Helper function to send SMS via SMSProvider
const sendSMSViaProvider = async (phoneNumber, message) => {
  try {
    // Format phone number (remove + and ensure proper format)
    const formattedPhone = phoneNumber.replace(/^\+/, '').replace(/\s/g, '');
    
    const response = await axios.get(SMS_PROVIDER_API_URL, {
      params: {
        username: process.env.SMS_PROVIDER_USERNAME,
        password: process.env.SMS_PROVIDER_PASSWORD,
        message: message,
        sender: process.env.SMS_PROVIDER_SENDER,
        mobiles: formattedPhone
      }
    });

    // SMSProvider returns JSON response
    if (response.data && response.data.status === 'OK') {
      return {
        success: true,
        messageId: `sms_${Date.now()}_${formattedPhone}`,
        status: 'sent',
        count: response.data.count || 1
      };
    } else {
      throw new Error(response.data?.error || 'SMS sending failed');
    }
  } catch (error) {
    console.error('SMSProvider API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || error.message || 'Failed to send SMS');
  }
};

// Send SMS to client or customer contacts
router.post('/send', auth, async (req, res) => {
  try {
    if (!smsProviderConfigured) {
      return res.status(500).json({ message: 'SMSProvider credentials not configured' });
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
          const smsResult = await sendSMSViaProvider(contact.phoneNumber, message);

          results.push({
            contactId: contact.id.toString(),
            contactName: contact.name || contact.phoneNumber,
            success: true,
            messageId: smsResult.messageId
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

    const smsResult = await sendSMSViaProvider(clientData.phoneNumber, message);

    res.json({
      success: true,
      messageId: smsResult.messageId,
      status: smsResult.status
    });
  } catch (error) {
    console.error('SMS Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Send bulk SMS to customer contacts
router.post('/send-bulk', auth, async (req, res) => {
  try {
    if (!smsProviderConfigured) {
      return res.status(500).json({ message: 'SMSProvider credentials not configured' });
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
        const smsResult = await sendSMSViaProvider(contact.phoneNumber, message);

        results.push({
          contactId: contact.id.toString(),
          contactName: contact.name || contact.phoneNumber,
          phoneNumber: contact.phoneNumber,
          success: true,
          messageId: smsResult.messageId
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
