const express = require('express');
const router = express.Router();

const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.post('/', async (req, res) => {

  try {

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Text is required'
      });
    }

    const completion =
      await groq.chat.completions.create({

        messages: [
          {
            role: 'system',
            content:
              'Generate a concise and meaningful summary.'
          },
          {
            role: 'user',
            content: text
          }
        ],

        model: 'llama-3.1-8b-instant'
      });

    const summary =
      completion.choices[0].message.content;

    res.json({ summary });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Summarization failed'
    });
  }
});

module.exports = router;