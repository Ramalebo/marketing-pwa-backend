const express = require('express');
const { Ad, Note, Client } = require('../models');
const { optionalAuth } = require('../middleware/auth');
const OpenAI = require('openai');

const router = express.Router();
// Use OpenRouter API (OpenAI-compatible) with free models
const openai = process.env.OPENROUTER_API_KEY 
  ? new OpenAI({ 
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1'
    }) 
  : null;

// Fallback models in order of preference
// Using confirmed available free models on OpenRouter
const FALLBACK_MODELS = [
  process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.2-3b-instruct:free',
  'x-ai/grok-4-fast:free',
  'meta-llama/llama-3.1-8b-instruct:free'
];

// Helper function to try multiple models with fallback
const tryWithFallback = async (models, requestFn) => {
  let lastError = null;
  
  for (const model of models) {
    try {
      return await requestFn(model);
    } catch (error) {
      lastError = error;
      if (error.status === 429 || error.code === 'rate_limit_exceeded' || error.message?.includes('rate-limit') ||
          error.status === 404 || error.status === 400 || error.status === 402 ||
          error.message?.includes('No endpoints found') || error.message?.includes('not found') ||
          error.message?.includes('not a valid model ID') || error.message?.includes('invalid model') ||
          error.message?.includes('spend limit exceeded') || error.message?.includes('Payment Required')) {
        console.log(`Model ${model} unavailable (${error.status || error.code}), trying next fallback...`);
        continue;
      }
      throw error;
    }
  }
  
  throw lastError;
};

// Helper to transform ad data
const transformAd = (ad) => {
  const data = ad.toJSON();
  const reach = data.reach != null ? Number(data.reach) : 0;
  const engagement = data.engagement != null ? Number(data.engagement) : 0;
  const spend = data.spend != null ? Number(data.spend) : 0;
  return {
    ...data,
    id: data.id.toString(),
    reach,
    engagement,
    spend,
    channel: data.channel || 'social',
    displayType: data.displayType || null,
    location: data.location || null,
    size: data.size || null,
    period: data.period || null,
    impressionsPerDay: data.impressionsPerDay != null ? Number(data.impressionsPerDay) : null,
    startDate: data.startDate || null,
    endDate: data.endDate || null,
    clientId: data.client ? {
      _id: data.client.id.toString(),
      id: data.client.id,
      name: data.client.name,
      businessName: data.client.businessName
    } : (data.clientId ? data.clientId.toString() : null),
    campaign: data.campaign || null,
    adset: data.adset || null,
    platform: data.platform || null,
    format: data.format || null,
    placement: data.placement || null,
    adType: data.adType || null,
    cta: data.cta || null,
    headline: data.headline || null,
    destinationUrl: data.destinationUrl || null,
    createdBy: data.createdBy.toString(),
    content: {
      images: data.contentImages || [],
      videos: data.contentVideos || [],
      text: data.contentText || ''
    }
  };
};

// Helper to transform ad input
const transformAdInput = (body) => {
  const data = { ...body };
  if (data.content) {
    data.contentImages = data.content.images || [];
    data.contentVideos = data.content.videos || [];
    data.contentText = data.content.text || '';
    delete data.content;
  }
  if (data.reach != null) data.reach = parseInt(data.reach, 10) || 0;
  if (data.engagement != null) data.engagement = parseFloat(data.engagement) || 0;
  if (data.spend != null) data.spend = parseFloat(data.spend) || 0;
  if (data.channel != null) data.channel = String(data.channel).slice(0, 32) || 'social';
  if (data.displayType !== undefined) data.displayType = data.displayType ? String(data.displayType).slice(0, 32) : null;
  if (data.location !== undefined) data.location = data.location ? String(data.location).slice(0, 255) : null;
  if (data.size !== undefined) data.size = data.size ? String(data.size).slice(0, 64) : null;
  if (data.period !== undefined) data.period = data.period ? String(data.period).slice(0, 64) : null;
  if (data.impressionsPerDay !== undefined) data.impressionsPerDay = data.impressionsPerDay != null ? parseInt(data.impressionsPerDay, 10) : null;
  if (data.startDate !== undefined) data.startDate = data.startDate || null;
  if (data.endDate !== undefined) data.endDate = data.endDate || null;
  if (data.campaign !== undefined) data.campaign = data.campaign ? String(data.campaign).slice(0, 255) : null;
  if (data.adset !== undefined) data.adset = data.adset ? String(data.adset).slice(0, 255) : null;
  if (data.platform !== undefined) data.platform = data.platform ? String(data.platform).slice(0, 64) : null;
  if (data.format !== undefined) data.format = data.format ? String(data.format).slice(0, 64) : null;
  if (data.placement !== undefined) data.placement = data.placement ? String(data.placement).slice(0, 128) : null;
  if (data.adType !== undefined) data.adType = data.adType ? String(data.adType).slice(0, 64) : null;
  if (data.cta !== undefined) data.cta = data.cta ? String(data.cta).slice(0, 64) : null;
  if (data.headline !== undefined) data.headline = data.headline ? String(data.headline).slice(0, 500) : null;
  if (data.destinationUrl !== undefined) data.destinationUrl = data.destinationUrl ? String(data.destinationUrl).slice(0, 1024) : null;
  return data;
};

const BULK_EDIT_FIELDS = ['campaign', 'adset', 'platform', 'format', 'placement', 'adType', 'cta', 'headline', 'destinationUrl', 'status', 'channel'];

// Bulk update ads (one field, many ads)
router.patch('/bulk', optionalAuth, async (req, res) => {
  try {
    const { ids, field, value } = req.body;
    if (!Array.isArray(ids) || ids.length === 0 || !field || !BULK_EDIT_FIELDS.includes(field)) {
      return res.status(400).json({
        message: 'Request must include ids (array), field (one of: ' + BULK_EDIT_FIELDS.join(', ') + '), and value'
      });
    }
    const where = { id: ids, createdBy: req.user.id };
    const ads = await Ad.findAll({ where: { id: ids, createdBy: req.user.id } });
    if (ads.length === 0) {
      return res.status(404).json({ message: 'No ads found to update' });
    }
    const updatePayload = {};
    if (['reach', 'engagement', 'spend', 'impressionsPerDay'].includes(field)) {
      const n = field === 'engagement' || field === 'spend' ? parseFloat(value) : parseInt(value, 10);
      updatePayload[field] = isNaN(n) ? 0 : n;
    } else {
      const v = value == null ? null : String(value).trim();
      updatePayload[field] = v || null;
    }
    await Ad.update(updatePayload, { where: { id: ids, createdBy: req.user.id } });
    const updated = await Ad.findAll({
      where: { id: ids, createdBy: req.user.id },
      include: [{ model: Client, as: 'client', attributes: ['id', 'name', 'businessName'], required: false }],
      order: [['createdAt', 'DESC']]
    });
    res.json(updated.map(transformAd));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all ads
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { status, clientId, channel } = req.query;
    const where = { createdBy: req.user.id };
    
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;
    if (channel) where.channel = channel;

    const ads = await Ad.findAll({
      where,
      include: [{
        model: Client,
        as: 'client',
        attributes: ['id', 'name', 'business_name'],
        required: false
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(ads.map(transformAd));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single ad
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const ad = await Ad.findOne({
      where: { 
        id: req.params.id, 
        createdBy: req.user.id 
      },
      include: [{
        model: Client,
        as: 'client',
        attributes: ['id', 'name', 'businessName'],
        required: false
      }]
    });
    
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }
    res.json(transformAd(ad));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate ad using AI
router.post('/generate', optionalAuth, async (req, res) => {
  try {
    if (!openai) {
      return res.status(500).json({ message: 'OpenRouter API key not configured' });
    }

    const { prompt, clientId, type } = req.body;

    // Get AI-relevant notes for context
    let contextNotes = '';
    if (clientId) {
      const notes = await Note.findAll({
        where: {
          clientId,
          createdBy: req.user.id,
          aiRelevant: true
        },
        limit: 10
      });
      contextNotes = notes.map(n => `${n.title}: ${n.content}`).join('\n');
    }

    const systemPrompt = `You are an expert marketing copywriter. Generate compelling ad content based on the user's prompt and any relevant context about the client.`;
    
    const userPrompt = contextNotes 
      ? `Client Context:\n${contextNotes}\n\nGenerate ad content for: ${prompt}`
      : `Generate ad content for: ${prompt}`;

    // Try with fallback models
    const completion = await tryWithFallback(FALLBACK_MODELS, async (model) => {
      return await openai.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 500
      });
    });

    const generatedContent = completion.choices[0].message.content;

    const ad = await Ad.create({
      title: `AI Generated Ad - ${new Date().toLocaleDateString()}`,
      description: generatedContent,
      type: type || 'image',
      aiGenerated: true,
      aiPrompt: prompt,
      contentText: generatedContent,
      contentImages: [],
      contentVideos: [],
      clientId: clientId || null,
      createdBy: req.user.id,
      status: 'draft'
    });

    if (ad.clientId) {
      await ad.reload({
        include: [{
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'businessName']
        }]
      });
    }

    res.status(201).json(transformAd(ad));
  } catch (error) {
    console.error('AI Generation Error:', error);
    
    // User-friendly error messages
    if (error.status === 402 || error.message?.includes('spend limit exceeded') || error.message?.includes('Payment Required')) {
      return res.status(402).json({ 
        message: 'API spending limit reached. Please check your OpenRouter account settings or wait for the limit to reset. Free models should still work, but the API key may have a spending limit configured.',
        retryAfter: 3600
      });
    }
    
    if (error.status === 429 || error.code === 'rate_limit_exceeded' || error.message?.includes('rate-limit')) {
      return res.status(429).json({ 
        message: 'AI service is currently busy. Please try again in a few moments. Free models have rate limits.',
        retryAfter: 60
      });
    }
    
    if (error.status === 404 || error.status === 400 ||
        error.message?.includes('No endpoints found') || error.message?.includes('not found') ||
        error.message?.includes('not a valid model ID') || error.message?.includes('invalid model')) {
      return res.status(503).json({ 
        message: 'AI model temporarily unavailable. Please try again in a moment. The system will automatically try alternative models.',
        retryAfter: 30
      });
    }
    
    res.status(500).json({ 
      message: error.message || 'Failed to generate ad content. Please try again later.'
    });
  }
});

// Create ad
router.post('/', optionalAuth, async (req, res) => {
  try {
    const adData = transformAdInput(req.body);
    const ad = await Ad.create({
      ...adData,
      createdBy: req.user.id
    });
    
    if (ad.clientId) {
      await ad.reload({
        include: [{
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'businessName']
        }]
      });
    }
    
    res.status(201).json(transformAd(ad));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update ad
router.put('/:id', optionalAuth, async (req, res) => {
  try {
    const ad = await Ad.findOne({
      where: { 
        id: req.params.id, 
        createdBy: req.user.id 
      }
    });
    
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }
    
    const adData = transformAdInput(req.body);
    await ad.update(adData);
    
    if (ad.clientId) {
      await ad.reload({
        include: [{
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'businessName']
        }]
      });
    }
    
    res.json(transformAd(ad));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete ad
router.delete('/:id', optionalAuth, async (req, res) => {
  try {
    const ad = await Ad.findOne({
      where: { 
        id: req.params.id, 
        createdBy: req.user.id 
      }
    });
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }
    await ad.destroy();
    res.json({ message: 'Ad deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
