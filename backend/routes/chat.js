const express = require('express');
const router = express.Router();

const Groq = require('groq-sdk');

const { getStore } = require('../services/vectorStore');
const { pdfMeta } = require('./upload');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

let currentPage = 1;

router.post('/', async (req, res) => {

  try {

    const { question } = req.body;

    console.log('User asked:', question);

    const cleaned =
      question.trim().toLowerCase();

    // NEXT PAGE COMMAND
    if (cleaned === 'next') {

      if (currentPage < pdfMeta.numPages) {
        currentPage++;
      }

      return res.json({
        answer: `Moved to page ${currentPage}`,
        page: currentPage
      });
    }

    // PREVIOUS PAGE COMMAND
    if (cleaned === 'previous') {

      if (currentPage > 1) {
        currentPage--;
      }

      return res.json({
        answer: `Moved to page ${currentPage}`,
        page: currentPage
      });
    }

    // GET PDF TEXT
    const store = getStore();

    const pdfText = store
      .map(chunk => chunk.text)
      .join('\n');

    // AI CHAT
    const completion =
      await groq.chat.completions.create({

        messages: [

          {
            role: 'system',
            content:
              `You are a PDF assistant.
               Answer ONLY from the uploaded PDF.
               Keep answers concise and clear.`
          },

          {
            role: 'user',
            content:
              `
              PDF Content:
              ${pdfText.slice(0, 12000)}

              Question:
              ${question}
              `
          }

        ],

        model: 'llama-3.1-8b-instant'
      });

    const answer =
      completion.choices[0]
        .message.content;

    res.json({
      answer,
      page: currentPage
    });

  } catch (error) {

    console.error('Chat Error:', error);

    res.status(500).json({
      answer: 'Chat failed',
      page: currentPage
    });
  }
});

module.exports = router;