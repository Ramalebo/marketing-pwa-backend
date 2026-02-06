const express = require('express');
const OpenAI = require('openai');
const { auth } = require('../middleware/auth');

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

// Generate hashtags using AI
router.post('/generate', auth, async (req, res) => {
  try {
    if (!openai) {
      return res.status(500).json({ message: 'OpenRouter API key not configured' });
    }

    const { content, platform, count = 10 } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const platformHints = {
      instagram: 'Instagram (focus on visual, lifestyle, trending hashtags)',
      facebook: 'Facebook (focus on engagement, community, business hashtags)',
      twitter: 'Twitter/X (focus on trending, news, conversation hashtags)',
      linkedin: 'LinkedIn (focus on professional, industry, business hashtags)'
    };

    const platformHint = platformHints[platform] || 'social media';

    const prompt = `Generate ${count} relevant hashtags for the following content, optimized for ${platformHint}. 
    Return only the hashtags, one per line, without numbers or bullet points. 
    Make them specific, relevant, and mix popular with niche hashtags.
    
    Content: ${content}`;

    // Try with fallback models
    const completion = await tryWithFallback(FALLBACK_MODELS, async (model) => {
      return await openai.chat.completions.create({
        model: model,
        messages: [
          { 
            role: "system", 
            content: "You are a social media marketing expert. Generate relevant, engaging hashtags for social media posts." 
          },
          { role: "user", content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.7
      });
    });

    const hashtagsText = completion.choices[0].message.content;
    const hashtags = hashtagsText
      .split('\n')
      .map(h => h.trim())
      .filter(h => h && h.startsWith('#'))
      .map(h => h.startsWith('#') ? h : `#${h}`)
      .slice(0, count);

    res.json({
      hashtags,
      count: hashtags.length
    });
  } catch (error) {
    console.error('Hashtag Generation Error:', error);
    
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
      message: error.message || 'Failed to generate hashtags. Please try again later.'
    });
  }
});

module.exports = router;

