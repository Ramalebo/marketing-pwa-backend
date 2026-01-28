const express = require('express');
const { Client, Note } = require('../models');
const { auth } = require('../middleware/auth');
const OpenAI = require('openai');

const router = express.Router();
// Use OpenRouter API (OpenAI-compatible) with free models
const openai = process.env.OPENROUTER_API_KEY 
  ? new OpenAI({ 
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1'
    }) 
  : null;

// Fallback models in order of preference (if one is rate-limited, try the next)
// Using confirmed available free models on OpenRouter
const FALLBACK_MODELS = [
  process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.2-3b-instruct:free',
  'liquidai/lfm2.5-1.2b-instruct:free',
  'xai/grok-beta:free',
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
      // If it's a rate limit error or model not found, try next model
      if (error.status === 429 || error.code === 'rate_limit_exceeded' || error.message?.includes('rate-limit') ||
          error.status === 404 || error.message?.includes('No endpoints found') || error.message?.includes('not found')) {
        console.log(`Model ${model} unavailable (${error.status || error.code}), trying next fallback...`);
        continue;
      }
      // For other errors, throw immediately
      throw error;
    }
  }
  
  // If all models failed, throw the last error
  throw lastError;
};

// Chat with AI chatbot
router.post('/chat', auth, async (req, res) => {
  try {
    if (!openai) {
      return res.status(500).json({ message: 'OpenRouter API key not configured' });
    }

    const { message, clientId } = req.body;

    let context = '';
    
    // Get client information if clientId is provided
    if (clientId) {
      const client = await Client.findOne({
        where: { 
          id: clientId, 
          createdBy: req.user.id 
        }
      });
      if (client) {
        const clientData = client.toJSON();
        context += `Client Information:\n`;
        context += `Name: ${clientData.name}\n`;
        if (clientData.business_name) context += `Business: ${clientData.business_name}\n`;
        if (clientData.email) context += `Email: ${clientData.email}\n`;
        if (clientData.phone_number) context += `Phone: ${clientData.phone_number}\n`;
        if (clientData.location_city || clientData.location_country) {
          context += `Location: ${clientData.location_city || ''}, ${clientData.location_country || ''}\n`;
        }
        context += `\n`;
      }

      // Get AI-relevant notes
      const notes = await Note.findAll({
        where: {
          clientId,
          createdBy: req.user.id,
          aiRelevant: true
        },
        limit: 10
      });

      if (notes.length > 0) {
        context += `Relevant Notes:\n`;
        notes.forEach(note => {
          context += `- ${note.title}: ${note.content}\n`;
        });
        context += `\n`;
      }
    }

    const systemPrompt = `You are an AI assistant for a multi-channel marketing platform. Help users with marketing tasks, client management, and campaign strategies. Use the provided context about clients and notes to give personalized advice.`;
    
    const userPrompt = context 
      ? `${context}User Question: ${message}`
      : message;

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

    const response = completion.choices[0].message.content;

    res.json({
      response,
      context: context ? 'Client context used' : 'No client context'
    });
  } catch (error) {
    console.error('Chatbot Error:', error);
    
    // User-friendly error messages
    if (error.status === 429 || error.code === 'rate_limit_exceeded' || error.message?.includes('rate-limit')) {
      return res.status(429).json({ 
        message: 'AI service is currently busy. Please try again in a few moments. Free models have rate limits.',
        retryAfter: 60
      });
    }
    
    if (error.status === 404 || error.message?.includes('No endpoints found') || error.message?.includes('not found')) {
      return res.status(503).json({ 
        message: 'AI model temporarily unavailable. Please try again in a moment. The system will automatically try alternative models.',
        retryAfter: 30
      });
    }
    
    res.status(500).json({ 
      message: error.message || 'Failed to get AI response. Please try again later.'
    });
  }
});

module.exports = router;
