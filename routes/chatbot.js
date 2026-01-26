const express = require('express');
const { Client, Note } = require('../models');
const { auth } = require('../middleware/auth');
const OpenAI = require('openai');

const router = express.Router();
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// Chat with AI chatbot
router.post('/chat', auth, async (req, res) => {
  try {
    if (!openai) {
      return res.status(500).json({ message: 'OpenAI API key not configured' });
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
        if (clientData.businessName) context += `Business: ${clientData.businessName}\n`;
        if (clientData.email) context += `Email: ${clientData.email}\n`;
        if (clientData.phoneNumber) context += `Phone: ${clientData.phoneNumber}\n`;
        if (clientData.locationCity || clientData.locationCountry) {
          context += `Location: ${clientData.locationCity || ''}, ${clientData.locationCountry || ''}\n`;
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
      model: "gpt-4",
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
