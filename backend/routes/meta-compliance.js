/**
 * Meta (Facebook) App compliance: Privacy Policy URL and Data Deletion.
 * Use these URLs in your Facebook App Basic Settings so the app is eligible for submission.
 *
 * In Meta Dashboard > App settings > Basic:
 * - Privacy policy URL: https://your-backend.com/api/meta/privacy
 * - Data deletion instructions URL: https://your-backend.com/api/meta/data-deletion
 * - Data deletion callback URL (optional): https://your-backend.com/api/meta/data-deletion-callback
 */

const express = require('express');
const crypto = require('crypto');

const router = express.Router();

const APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const CONTACT_EMAIL = process.env.META_CONTACT_EMAIL || process.env.CONTACT_EMAIL || 'onkabetsen23@gmail.com';
const APP_NAME = process.env.APP_NAME || 'Dominant Logic Marketing';

/**
 * Decode and verify Facebook signed_request.
 * @param {string} signedRequest - The signed_request from Facebook POST body
 * @returns {object|null} Decoded payload or null if invalid
 */
function parseSignedRequest(signedRequest) {
  if (!signedRequest || !APP_SECRET) return null;
  const [encodedSig, payload] = signedRequest.split('.');
  if (!encodedSig || !payload) return null;

  const decodeBase64Url = (str) => {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    if (pad) base64 += '===='.slice(0, 4 - pad);
    return Buffer.from(base64, 'base64').toString('utf8');
  };

  const expectedSig = crypto
    .createHmac('sha256', APP_SECRET)
    .update(payload)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  if (encodedSig !== expectedSig) return null;

  try {
    return JSON.parse(decodeBase64Url(payload));
  } catch {
    return null;
  }
}

/**
 * GET /api/meta/ok
 * Test endpoint: returns base URL and links to compliance pages. Use to verify backend is up and get URLs to open.
 */
router.get('/ok', (req, res) => {
  const base = `${req.protocol}://${req.get('host')}`;
  res.json({
    ok: true,
    message: 'Meta compliance routes are available. Use these URLs in your browser or in Meta App Basic Settings.',
    baseUrl: base,
    urls: {
      privacy: `${base}/api/meta/privacy`,
      dataDeletion: `${base}/api/meta/data-deletion`,
      dataDeletionCallback: `${base}/api/meta/data-deletion-callback`
    },
    appSecretConfigured: !!APP_SECRET
  });
});

/**
 * GET /api/meta/privacy
 * Privacy policy page for Meta App settings (Privacy policy URL).
 */
router.get('/privacy', (req, res) => {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy - ${APP_NAME}</title>
</head>
<body style="font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6;">
  <h1>Privacy Policy</h1>
  <p><strong>${APP_NAME}</strong> ("we") respects your privacy. This policy describes what data we collect and how we use it.</p>

  <h2>Data we collect</h2>
  <ul>
    <li><strong>Account data:</strong> When you register, we store your name, email address, and a hashed password.</li>
    <li><strong>Business data:</strong> If you use our marketing features, we store clients, notes, ads, and related content you create.</li>
    <li><strong>Usage:</strong> We may log requests to our API (e.g. IP, timestamp) for security and operation.</li>
  </ul>

  <h2>How we use data</h2>
  <p>We use your data to provide the service (dashboard, ads, social posting, AI features), to communicate with you, and to improve our product. We do not sell your personal data to third parties.</p>

  <h2>Third-party services</h2>
  <p>We use services such as OpenRouter (AI), Mailtrap (email), and Meta (Facebook/Instagram/WhatsApp) for features you enable. Their privacy policies apply to data processed by them.</p>

  <h2>Data retention and deletion</h2>
  <p>You may request deletion of your account and associated data at any time. See our <a href="./data-deletion">Data deletion</a> page for instructions.</p>

  <h2>Contact</h2>
  <p>For privacy questions or requests: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.</p>

  <p><small>Last updated: ${new Date().toISOString().slice(0, 10)}.</small></p>
</body>
</html>
  `);
});

/**
 * GET /api/meta/data-deletion
 * Data deletion instructions page for Meta App settings (User data deletion instructions URL).
 */
router.get('/data-deletion', (req, res) => {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Data Deletion - ${APP_NAME}</title>
</head>
<body style="font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6;">
  <h1>Data Deletion</h1>
  <p>You can request deletion of your data at any time.</p>

  <h2>If you have an account with us</h2>
  <p>Send an email to <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> with the subject "Data deletion request" and the email address you used to register. We will delete your account and associated data (clients, notes, ads, post history, etc.) within 30 days and confirm by email.</p>

  <h2>Facebook / Meta data</h2>
  <p>Our app does not use Facebook Login. We do not store your Facebook profile data. We use Meta APIs only to post content to pages you connect (Facebook Page, Instagram, WhatsApp). If you have connected a Page or account, revoking access in your Facebook/Meta settings will stop our app from posting on your behalf. For any other data linked to your identity that you believe we hold, contact us at <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.</p>

  <h2>Contact</h2>
  <p><a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p>

  <p><a href="./privacy">Privacy policy</a></p>
</body>
</html>
  `);
});

/**
 * POST /api/meta/data-deletion-callback
 * Meta Data Deletion Request Callback. Facebook POSTs a signed_request here when a user requests data deletion.
 * Required response: JSON with url and confirmation_code.
 * @see https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback/
 */
router.post('/data-deletion-callback', (req, res) => {
  const signedRequest = req.body.signed_request;

  if (!APP_SECRET) {
    return res.status(500).json({
      url: `${req.protocol}://${req.get('host')}/api/meta/data-deletion`,
      confirmation_code: 'CONFIG_MISSING',
      error: 'FACEBOOK_APP_SECRET not configured'
    });
  }

  const payload = parseSignedRequest(signedRequest);
  const statusUrl = `${req.protocol}://${req.get('host')}/api/meta/data-deletion`;

  if (!payload || !payload.user_id) {
    return res.status(400).json({
      url: statusUrl,
      confirmation_code: 'INVALID_REQUEST'
    });
  }

  const facebookUserId = payload.user_id;
  const confirmationCode = `DL_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  // This app uses email/password auth; we do not store data keyed by Facebook user ID.
  // If you later add Facebook Login and store user_id, delete that user's data here.
  // Example: await User.destroy({ where: { facebookUserId } });
  console.log(`[Meta] Data deletion requested for Facebook user_id: ${facebookUserId}, confirmation_code: ${confirmationCode}`);

  res.status(200).json({
    url: statusUrl,
    confirmation_code: confirmationCode
  });
});

module.exports = router;
