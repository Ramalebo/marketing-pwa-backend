const express = require('express');
const OpenAI = require('openai');
const { auth } = require('../middleware/auth');

const router = express.Router();
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// Generate hashtags using AI
router.post('/generate', auth, async (req, res) => {
  try {
    if (!openai) {
      return res.status(500).json({ message: 'OpenAI API key not configured' });
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

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
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
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

