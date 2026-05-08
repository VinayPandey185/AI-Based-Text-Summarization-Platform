const express = require('express');

const router = express.Router();

const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.post('/', async (req, res) => {

  try {

    const { text } = req.body;

    // Validation
    if (!text || !text.trim()) {

      return res.status(400).json({
        error: 'Text is required'
      });
    }

    const completion =
      await groq.chat.completions.create({

        model: 'llama-3.1-8b-instant',

        temperature: 0.3,

        max_tokens: 300,

        messages: [

          {
            role: 'system',

            content:
              `You are an AI summarization assistant.
Generate a concise, professional, and meaningful summary.

Rules:
- Do NOT use markdown
- Do NOT use ** stars
- Do NOT use bullet markdown symbols
- Use plain readable text
- Keep formatting clean and professional
- Avoid repeating sentences`
          },

          {
            role: 'user',

            content: text
          }
        ]
      });

{/* Extract the summary from the response and clean it up*/}
    let summary = completion.choices[0].message.content;

summary = summary

  // remove **
  .replace(/\*\*/g, "")

  // remove single *
  .replace(/\*/g, "")

  // remove extra spaces
  .replace(/\s+/g, " ")

  // clean formatting
  .trim();
    res.json({ summary });

  } catch (error) {

    console.error(
      'Summarization Error:',
      error
    );

    res.status(500).json({
      error: 'Summarization failed'
    });
  }
});

module.exports = router;