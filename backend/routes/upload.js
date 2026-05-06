const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');

const Groq = require('groq-sdk');

const {
  indexPDFText
} = require('../services/vectorStore');

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

let pdfMeta = {
  numPages: 1
};

const storage = multer.diskStorage({

  destination: 'uploads/',

  filename: (req, file, cb) => {
    cb(null,
      Date.now() + '-' + file.originalname
    );
  }
});

const upload = multer({ storage });

router.post(
  '/',
  upload.single('file'),

  async (req, res) => {

    try {

      const dataBuffer =
        fs.readFileSync(req.file.path);

      const data =
        await pdfParse(dataBuffer);

      pdfMeta.numPages = data.numpages;

      const extractedText = data.text;

      fs.mkdirSync('texts', {
        recursive: true
      });

      const textFile =
        `texts/${req.file.filename}.txt`;

      fs.writeFileSync(
        textFile,
        extractedText
      );

      await indexPDFText(textFile);

      // AI SUMMARY

      const completion =
        await groq.chat.completions.create({

          messages: [
            {
              role: 'system',
              content:
                'Generate a clear summary of this PDF.'
            },

            {
              role: 'user',
              content:
                extractedText.slice(0, 12000)
            }
          ],

          model: 'llama-3.1-8b-instant'
        });

      const summary =
        completion.choices[0]
          .message.content;

      res.json({
        filePath:
          `/uploads/${req.file.filename}`,
        summary
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error: 'Upload failed'
      });
    }
  }
);

module.exports = router;
module.exports.pdfMeta = pdfMeta;