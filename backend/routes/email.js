const express = require('express');
const nodemailer = require('nodemailer');
const { MailtrapClient } = require('mailtrap');
const { Client, CustomerContact } = require('../models');
const { optionalAuth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Domain SMTP (e.g. mail.dominantlogic.tech) – used when SMTP_HOST is set
const getSmtpTransporter = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!host || !user || !pass) return null;
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = port === 465;
  const insecureTls = (process.env.SMTP_INSECURE_TLS || '').toLowerCase() === 'true';
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: { rejectUnauthorized: !insecureTls }
  });
};

const getMailtrapClient = () => {
  if (!process.env.MAILTRAP_API_TOKEN) return null;
  return new MailtrapClient({ token: process.env.MAILTRAP_API_TOKEN });
};

const getSender = () => {
  const name = (process.env.SMTP_SENDER_NAME || process.env.MAILTRAP_SENDER_NAME || 'Marketing Platform')
    .replace(/^["']|["']$/g, '')
    .trim();
  return {
    email: process.env.SMTP_USER || process.env.MAILTRAP_SENDER_EMAIL || 'noreply@dominantlogic.tech',
    name: name || 'Marketing Platform'
  };
};

// Send one email: prefer domain SMTP, fallback to Mailtrap
const sendEmail = async (toEmail, subject, html, text, fromEmail, fromName) => {
  const transporter = getSmtpTransporter();
  if (transporter) {
    try {
      const bodyText = text || html || '';
      const bodyHtml = html || text || '';
      const hasContent = (bodyText && bodyText.trim()) || (bodyHtml && bodyHtml.trim());
      const info = await transporter.sendMail({
        from: `"${(fromName || '').replace(/"/g, '')}" <${fromEmail}>`,
        to: toEmail,
        subject: subject || 'Message from Marketing Platform',
        text: hasContent ? (bodyText.trim() || bodyHtml.trim()) : ' ',
        html: hasContent ? (bodyHtml.trim() || bodyText.trim()) : '<p> </p>'
      });
      return { messageId: info.messageId };
    } catch (err) {
      const msg = err.message || String(err);
      if (/ECONNREFUSED|ETIMEDOUT|ENOTFOUND/.test(msg)) {
        throw new Error(`Email server unreachable (${process.env.SMTP_HOST}). Check SMTP_HOST, SMTP_PORT, and firewall.`);
      }
      if (/Invalid login|Authentication failed|credentials/.test(msg)) {
        throw new Error('Email login failed. Check SMTP_USER and SMTP_PASSWORD.');
      }
      throw err;
    }
  }
  const mailtrap = getMailtrapClient();
  if (mailtrap) {
    const response = await mailtrap.send({
      from: { name: fromName, email: fromEmail },
      to: [{ email: toEmail }],
      subject: subject || 'Message from Marketing Platform',
      text: text || html || '',
      html: html || text || ''
    });
    return { messageId: response.message_ids?.[0] || 'sent' };
  }
  throw new Error('Email not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD (domain email) or MAILTRAP_API_TOKEN.');
};

// Check if email is configured (for Render/env verification – no secrets exposed)
router.get('/status', (req, res) => {
  const smtp = getSmtpTransporter();
  const mailtrap = getMailtrapClient();
  const configured = !!(smtp || mailtrap);
  res.json({
    configured,
    method: smtp ? 'smtp' : (mailtrap ? 'mailtrap' : null),
    message: configured
      ? `Email configured via ${smtp ? 'SMTP (domain)' : 'Mailtrap'}`
      : 'Email not configured. Add SMTP_HOST, SMTP_USER, SMTP_PASSWORD (or MAILTRAP_API_TOKEN) in Render Environment.'
  });
});

// Send email to client or customer contacts (uses domain SMTP or Mailtrap)
router.post('/send', optionalAuth, async (req, res) => {
  try {
    const hasEmail = getSmtpTransporter() || getMailtrapClient();
    if (!hasEmail) {
      return res.status(500).json({ message: 'Email not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD or MAILTRAP_API_TOKEN.' });
    }

    const { clientId, subject, html, text, contactIds } = req.body;
    const { email: senderEmail, name: senderName } = getSender();

    const clientData = await Client.findOne({
      where: { id: clientId, createdBy: req.user.id }
    });
    if (!clientData) {
      return res.status(404).json({ message: 'Client not found' });
    }

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
          const { messageId } = await sendEmail(contact.email, subject, html, text, senderEmail, senderName);
          results.push({
            contactId: contact.id.toString(),
            contactName: contact.name || contact.email,
            success: true,
            messageId
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

    if (!clientData.email) {
      return res.status(400).json({ message: 'Client does not have an email address' });
    }

    const { messageId } = await sendEmail(clientData.email, subject, html, text, senderEmail, senderName);
    res.json({
      success: true,
      messageId,
      response: 'Email sent successfully'
    });
  } catch (error) {
    console.error('Email Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Send bulk email to customer contacts (uses domain SMTP or Mailtrap)
router.post('/send-bulk', optionalAuth, async (req, res) => {
  try {
    const hasEmail = getSmtpTransporter() || getMailtrapClient();
    if (!hasEmail) {
      return res.status(500).json({ message: 'Email not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD or MAILTRAP_API_TOKEN.' });
    }

    const { clientId, subject, html, text, contactIds } = req.body;
    const { email: senderEmail, name: senderName } = getSender();

    if (!clientId) {
      return res.status(400).json({ message: 'clientId is required' });
    }

    const clientData = await Client.findOne({
      where: { id: clientId, createdBy: req.user.id }
    });
    if (!clientData) {
      return res.status(404).json({ message: 'Client not found' });
    }

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
        const { messageId } = await sendEmail(contact.email, subject, html, text, senderEmail, senderName);
        results.push({
          contactId: contact.id.toString(),
          contactName: contact.name || contact.email,
          email: contact.email,
          success: true,
          messageId
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
