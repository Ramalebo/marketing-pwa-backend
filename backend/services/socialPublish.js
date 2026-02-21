const axios = require('axios');
const FACEBOOK_API_BASE = 'https://graph.facebook.com/v18.0';

function getFacebookToken() {
  return process.env.FACEBOOK_ACCESS_TOKEN || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
}
function getInstagramAccountId() {
  return process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
}
function getWhatsAppCredentials() {
  return {
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID
  };
}

async function postToFacebook(ad, imageUrl, message) {
  const accessToken = getFacebookToken();
  const pageId = process.env.FACEBOOK_PAGE_ID;
  if (!accessToken || !pageId) throw new Error('Facebook credentials not configured');
  const adData = ad.toJSON ? ad.toJSON() : ad;
  const contentText = adData.contentText || (adData.content && adData.content.text) || '';
  const postData = { message: message || adData.description || contentText || '', access_token: accessToken };
  if (imageUrl) {
    const imageUrlFull = imageUrl.startsWith('http') ? imageUrl : `${process.env.FRONTEND_URL || 'http://localhost:3000'}${imageUrl}`;
    const photoResponse = await axios.post(`${FACEBOOK_API_BASE}/${pageId}/photos`, { url: imageUrlFull, caption: postData.message, access_token: accessToken });
    return { postId: photoResponse.data.id, type: 'photo' };
  }
  const response = await axios.post(`${FACEBOOK_API_BASE}/${pageId}/feed`, postData);
  return { postId: response.data.id, type: 'text' };
}

async function postToInstagram(ad, imageUrl, caption) {
  const accessToken = getFacebookToken();
  const instagramAccountId = getInstagramAccountId();
  if (!accessToken || !instagramAccountId) throw new Error('Instagram credentials not configured');
  if (!imageUrl) throw new Error('Instagram requires an image');
  const adData = ad.toJSON ? ad.toJSON() : ad;
  const contentText = adData.contentText || (adData.content && adData.content.text) || '';
  const imageUrlFull = imageUrl.startsWith('http') ? imageUrl : `${process.env.FRONTEND_URL || 'http://localhost:3000'}${imageUrl}`;
  const containerResponse = await axios.post(`${FACEBOOK_API_BASE}/${instagramAccountId}/media`, { image_url: imageUrlFull, caption: caption || adData.description || contentText || '', access_token: accessToken });
  const publishResponse = await axios.post(`${FACEBOOK_API_BASE}/${instagramAccountId}/media_publish`, { creation_id: containerResponse.data.id, access_token: accessToken });
  return { postId: publishResponse.data.id };
}

async function sendWhatsApp(ad, phoneNumber, message) {
  const credentials = getWhatsAppCredentials();
  if (!credentials.phoneNumberId || !credentials.accessToken) throw new Error('WhatsApp credentials not configured');
  const adData = ad.toJSON ? ad.toJSON() : ad;
  const contentText = adData.contentText || (adData.content && adData.content.text) || '';
  const formattedPhone = phoneNumber.replace(/[^\d+]/g, '');
  const response = await axios.post(`https://graph.facebook.com/v18.0/${credentials.phoneNumberId}/messages`, { messaging_product: 'whatsapp', to: formattedPhone, type: 'text', text: { body: message || adData.description || contentText || '' } }, { headers: { 'Authorization': `Bearer ${credentials.accessToken}`, 'Content-Type': 'application/json' } });
  return { messageId: response.data.messages[0].id };
}

module.exports = { postToFacebook, postToInstagram, sendWhatsApp };
