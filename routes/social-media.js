const express = require('express');
const axios = require('axios');
const { Ad, PostHistory } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Facebook/Instagram Graph API base URL
const FACEBOOK_API_BASE = 'https://graph.facebook.com/v18.0';

// Helper function to get Facebook access token
const getFacebookToken = () => {
  return process.env.FACEBOOK_ACCESS_TOKEN || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
};

// Helper function to get Instagram Business Account ID
const getInstagramAccountId = () => {
  return process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
};

// Helper function to get WhatsApp Business API credentials
const getWhatsAppCredentials = () => {
  return {
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID
  };
};

// Helper function to post to Facebook (extracted for reuse)
const postToFacebook = async (ad, imageUrl, message) => {
  const accessToken = getFacebookToken();
  const pageId = process.env.FACEBOOK_PAGE_ID;

  if (!accessToken || !pageId) {
    throw new Error('Facebook credentials not configured');
  }

  const adData = ad.toJSON ? ad.toJSON() : ad;
  const contentText = adData.contentText || (adData.content && adData.content.text) || '';
  const postData = {
    message: message || adData.description || contentText || '',
    access_token: accessToken
  };

  if (imageUrl) {
    const imageUrlFull = imageUrl.startsWith('http') 
      ? imageUrl 
      : `${process.env.FRONTEND_URL || 'http://localhost:3000'}${imageUrl}`;
    
    const photoResponse = await axios.post(
      `${FACEBOOK_API_BASE}/${pageId}/photos`,
      {
        url: imageUrlFull,
        caption: postData.message,
        access_token: accessToken
      }
    );
    return { postId: photoResponse.data.id, type: 'photo' };
  } else {
    const response = await axios.post(
      `${FACEBOOK_API_BASE}/${pageId}/feed`,
      postData
    );
    return { postId: response.data.id, type: 'text' };
  }
};

// Helper function to post to Instagram (extracted for reuse)
const postToInstagram = async (ad, imageUrl, caption) => {
  const accessToken = getFacebookToken();
  const instagramAccountId = getInstagramAccountId();

  if (!accessToken || !instagramAccountId) {
    throw new Error('Instagram credentials not configured');
  }

  if (!imageUrl) {
    throw new Error('Instagram requires an image');
  }

  const adData = ad.toJSON ? ad.toJSON() : ad;
  const contentText = adData.contentText || (adData.content && adData.content.text) || '';

  const imageUrlFull = imageUrl.startsWith('http') 
    ? imageUrl 
    : `${process.env.FRONTEND_URL || 'http://localhost:3000'}${imageUrl}`;

  const containerResponse = await axios.post(
    `${FACEBOOK_API_BASE}/${instagramAccountId}/media`,
    {
      image_url: imageUrlFull,
      caption: caption || adData.description || contentText || '',
      access_token: accessToken
    }
  );

  const creationId = containerResponse.data.id;

  const publishResponse = await axios.post(
    `${FACEBOOK_API_BASE}/${instagramAccountId}/media_publish`,
    {
      creation_id: creationId,
      access_token: accessToken
    }
  );

  return { postId: publishResponse.data.id };
};

// Helper function to send WhatsApp (extracted for reuse)
const sendWhatsApp = async (ad, phoneNumber, message) => {
  const credentials = getWhatsAppCredentials();

  if (!credentials.phoneNumberId || !credentials.accessToken) {
    throw new Error('WhatsApp credentials not configured');
  }

  const adData = ad.toJSON ? ad.toJSON() : ad;
  const contentText = adData.contentText || (adData.content && adData.content.text) || '';

  const formattedPhone = phoneNumber.replace(/[^\d+]/g, '');

  const response = await axios.post(
    `https://graph.facebook.com/v18.0/${credentials.phoneNumberId}/messages`,
    {
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: 'text',
      text: {
        body: message || adData.description || contentText || ''
      }
    },
    {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return { messageId: response.data.messages[0].id };
};

// Post to Facebook Page
router.post('/facebook', auth, async (req, res) => {
  try {
    const { adId, message, imageUrl } = req.body;

    const ad = await Ad.findOne({
      where: { 
        id: adId, 
        createdBy: req.user.id 
      }
    });
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    const result = await postToFacebook(ad, imageUrl, message);

    // Save post history
    await PostHistory.create({
      adId: ad.id,
      platform: 'facebook',
      postId: result.postId,
      status: 'success',
      message: 'Posted to Facebook successfully',
      publishedAt: new Date(),
      createdBy: req.user.id
    });

    return res.json({
      success: true,
      platform: 'facebook',
      postId: result.postId,
      message: 'Posted to Facebook successfully'
    });
  } catch (error) {
    console.error('Facebook Post Error:', error.response?.data || error.message);
    return res.status(500).json({ 
      message: 'Error posting to Facebook: ' + (error.response?.data?.error?.message || error.message) 
    });
  }
});

// Post to Instagram
router.post('/instagram', auth, async (req, res) => {
  try {
    const { adId, caption, imageUrl } = req.body;

    const ad = await Ad.findOne({
      where: { 
        id: adId, 
        createdBy: req.user.id 
      }
    });
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    const result = await postToInstagram(ad, imageUrl, caption);

    // Save post history
    await PostHistory.create({
      adId: ad.id,
      platform: 'instagram',
      postId: result.postId,
      status: 'success',
      message: 'Posted to Instagram successfully',
      publishedAt: new Date(),
      createdBy: req.user.id
    });

    return res.json({
      success: true,
      platform: 'instagram',
      postId: result.postId,
      message: 'Posted to Instagram successfully'
    });
  } catch (error) {
    console.error('Instagram Post Error:', error.response?.data || error.message);
    return res.status(500).json({ 
      message: 'Error posting to Instagram: ' + (error.response?.data?.error?.message || error.message) 
    });
  }
});

// Send WhatsApp Message (via WhatsApp Business API)
router.post('/whatsapp', auth, async (req, res) => {
  try {
    const { adId, phoneNumber, message } = req.body;

    const ad = await Ad.findOne({
      where: { 
        id: adId, 
        createdBy: req.user.id 
      }
    });
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    const result = await sendWhatsApp(ad, phoneNumber, message);

    // Save post history
    await PostHistory.create({
      adId: ad.id,
      platform: 'whatsapp',
      postId: result.messageId,
      status: 'success',
      message: 'Sent via WhatsApp successfully',
      publishedAt: new Date(),
      createdBy: req.user.id
    });

    return res.json({
      success: true,
      platform: 'whatsapp',
      messageId: result.messageId,
      message: 'Sent via WhatsApp successfully'
    });
  } catch (error) {
    console.error('WhatsApp Send Error:', error.response?.data || error.message);
    return res.status(500).json({ 
      message: 'Error sending WhatsApp message: ' + (error.response?.data?.error?.message || error.message) 
    });
  }
});

// Post to multiple platforms at once
router.post('/publish', auth, async (req, res) => {
  try {
    const { adId, platforms, phoneNumber } = req.body;
    
    if (!platforms || platforms.length === 0) {
      return res.status(400).json({ message: 'Please select at least one platform' });
    }

    const ad = await Ad.findOne({
      where: { 
        id: adId, 
        createdBy: req.user.id 
      }
    });
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    const results = [];
    const adData = ad.toJSON();
    const contentImages = adData.contentImages || [];
    const imageUrl = contentImages[0] || null;
    const message = adData.description || adData.contentText || '';

    // Post to Facebook
    if (platforms.includes('facebook')) {
      try {
        const result = await postToFacebook(ad, imageUrl, message);
        results.push({ 
          platform: 'facebook', 
          success: true, 
          postId: result.postId,
          message: 'Posted to Facebook successfully' 
        });
        
        // Save post history
        await PostHistory.create({
          adId: ad.id,
          platform: 'facebook',
          postId: result.postId,
          status: 'success',
          message: 'Posted to Facebook successfully',
          publishedAt: new Date(),
          createdBy: req.user.id
        });
      } catch (error) {
        results.push({ 
          platform: 'facebook', 
          success: false, 
          error: error.response?.data?.error?.message || error.message 
        });
        
        // Save failed post history
        await PostHistory.create({
          adId: ad.id,
          platform: 'facebook',
          status: 'failed',
          error: error.response?.data?.error?.message || error.message,
          publishedAt: new Date(),
          createdBy: req.user.id
        });
      }
    }

    // Post to Instagram
    if (platforms.includes('instagram')) {
      try {
        const result = await postToInstagram(ad, imageUrl, message);
        results.push({ 
          platform: 'instagram', 
          success: true, 
          postId: result.postId,
          message: 'Posted to Instagram successfully' 
        });
        
        // Save post history
        await PostHistory.create({
          adId: ad.id,
          platform: 'instagram',
          postId: result.postId,
          status: 'success',
          message: 'Posted to Instagram successfully',
          publishedAt: new Date(),
          createdBy: req.user.id
        });
      } catch (error) {
        results.push({ 
          platform: 'instagram', 
          success: false, 
          error: error.response?.data?.error?.message || error.message 
        });
        
        // Save failed post history
        await PostHistory.create({
          adId: ad.id,
          platform: 'instagram',
          status: 'failed',
          error: error.response?.data?.error?.message || error.message,
          publishedAt: new Date(),
          createdBy: req.user.id
        });
      }
    }

    // Send via WhatsApp
    if (platforms.includes('whatsapp')) {
      if (!phoneNumber) {
        results.push({ 
          platform: 'whatsapp', 
          success: false, 
          error: 'Phone number required for WhatsApp' 
        });
      } else {
        try {
          const result = await sendWhatsApp(ad, phoneNumber, message);
          results.push({ 
            platform: 'whatsapp', 
            success: true, 
            messageId: result.messageId,
            message: 'Sent via WhatsApp successfully' 
          });
          
          // Save post history
          await PostHistory.create({
            adId: ad.id,
            platform: 'whatsapp',
            postId: result.messageId,
            status: 'success',
            message: 'Sent via WhatsApp successfully',
            publishedAt: new Date(),
            createdBy: req.user.id
          });
        } catch (error) {
          results.push({ 
            platform: 'whatsapp', 
            success: false, 
            error: error.response?.data?.error?.message || error.message 
          });
          
          // Save failed post history
          await PostHistory.create({
            adId: ad.id,
            platform: 'whatsapp',
            status: 'failed',
            error: error.response?.data?.error?.message || error.message,
            publishedAt: new Date(),
            createdBy: req.user.id
          });
        }
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    return res.json({
      success: successCount > 0,
      total: totalCount,
      successful: successCount,
      results
    });
  } catch (error) {
    console.error('Multi-Platform Publish Error:', error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
