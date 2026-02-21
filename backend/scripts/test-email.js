#!/usr/bin/env node
/**
 * Test SMTP (email) connection and optionally send a test email.
 * Loads .env from backend root. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD.
 * Usage: node scripts/test-email.js [test@example.com]
 * If an email is provided, sends a test message; otherwise only verifies the connection.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const nodemailer = require('nodemailer');

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!host || !user || !pass) {
    throw new Error('Missing SMTP_HOST, SMTP_USER, or SMTP_PASSWORD in environment.');
  }
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = port === 465;
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: { rejectUnauthorized: process.env.SMTP_INSECURE_TLS !== 'true' }
  });
}

function getSender() {
  const name = (process.env.SMTP_SENDER_NAME || 'Marketing Platform')
    .replace(/^["']|["']$/g, '')
    .trim();
  return {
    email: process.env.SMTP_USER || 'noreply@example.com',
    name: name || 'Marketing Platform'
  };
}

async function run() {
  console.log('\n=== Email (SMTP) connection test ===\n');
  const sendTo = process.argv[2];

  try {
    const transporter = getTransporter();
    console.log('SMTP server:', process.env.SMTP_HOST + ':' + (process.env.SMTP_PORT || '465'));
    console.log('SMTP user:', process.env.SMTP_USER);

    await transporter.verify();
    console.log('✓ SMTP connection verified (server accepted credentials).');

    if (sendTo) {
      const sender = getSender();
      const info = await transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,
        to: sendTo,
        subject: 'Test email from Marketing Platform',
        text: 'This is a test email. If you received this, SMTP is working.',
        html: '<p>This is a test email. If you received this, SMTP is working.</p>'
      });
      console.log('✓ Test email sent to', sendTo, '| MessageId:', info.messageId);
    } else {
      console.log('(No recipient given. To send a test email: node scripts/test-email.js your@email.com)');
    }

    console.log('\n✓ Email test passed.\n');
    process.exit(0);
  } catch (err) {
    console.error('\n✗ Email test failed:', err.message);
    if (err.response) console.error('  ', err.response);
    process.exit(1);
  }
}

run();
