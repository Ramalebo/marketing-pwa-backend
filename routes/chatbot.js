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
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.2-3b-instruct:free';

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

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 500
    });

    const response = completion.choices[0].message.content;

    res.json({
      response,
      context: context ? 'Client context used' : 'No client context'
    });
  } catch (error) {
    console.error('Chatbot Error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
