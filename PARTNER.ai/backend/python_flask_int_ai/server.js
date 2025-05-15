// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve frontend files

// OpenAI setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Chat route
app.post('/chat', async (req, res) => {
  const { message, tone = 'female' } = req.body;

  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a friendly, emotional, helpful assistant called Partner.ai.',
        },
        { role: 'user', content: message }
      ]
    });

    const reply = response.data.choices[0].message.content;

    // In production, replace with a real voice/audio API
    const audioUrl = `https://fake-audio-api.com/speak?voice=${tone}&text=${encodeURIComponent(reply)}`;

    res.json({ reply, audio_url: audioUrl });
  } catch (err) {
    console.error('OpenAI Error:', err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
