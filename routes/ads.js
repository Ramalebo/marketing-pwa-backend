const express = require('express');
const { Ad, Note, Client } = require('../models');
const { auth } = require('../middleware/auth');
const OpenAI = require('openai');

const router = express.Router();
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// Helper to transform ad data
const transformAd = (ad) => {
  const data = ad.toJSON();
  return {
    ...data,
    id: data.id.toString(),
    clientId: data.client ? {
      _id: data.client.id.toString(),
      name: data.client.name,
      businessName: data.client.businessName
    } : (data.clientId ? data.clientId.toString() : null),
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
  return data;
};

// Get all ads
router.get('/', auth, async (req, res) => {
  try {
    const { status, clientId } = req.query;
    const where = { createdBy: req.user.id };
    
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;

    const ads = await Ad.findAll({
      where,
      include: [{
        model: Client,
        as: 'client',
        attributes: ['id', 'name', 'businessName'],
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
router.get('/:id', auth, async (req, res) => {
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
router.post('/generate', auth, async (req, res) => {
  try {
    if (!openai) {
      return res.status(500).json({ message: 'OpenAI API key not configured' });
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

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 500
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
    res.status(500).json({ message: error.message });
  }
});

// Create ad
router.post('/', auth, async (req, res) => {
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
router.put('/:id', auth, async (req, res) => {
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
router.delete('/:id', auth, async (req, res) => {
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
