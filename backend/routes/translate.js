const express = require('express');
const axios = require('axios');

const router = express.Router();

// Simple proxy route to avoid CORS issues on frontend
router.post('/', async (req, res) => {
  const { text, source, target } = req.body;

  if (!text || !target) {
    return res.status(400).json({ error: 'Text and target language are required' });
  }

  try {
    let detected = null;
    let src = source;

    // If client asked for auto-detect, call detect endpoint first
    if (source === 'auto') {
      try {
        const detectRes = await axios.post(
          'https://libretranslate.de/detect',
          { q: text },
          { headers: { accept: 'application/json', 'Content-Type': 'application/json' } }
        );

        // detect endpoint returns an array of detections
        if (Array.isArray(detectRes.data) && detectRes.data.length > 0) {
          detected = detectRes.data[0].language || null;
          src = detected || 'auto';
        }
      } catch (dErr) {
        console.warn('Language detection failed, proceeding with provided source:', dErr.message || dErr);
      }
    }

    const response = await axios.post(
      'https://libretranslate.de/translate',
      {
        q: text,
        source: src === 'auto' ? 'auto' : src,
        target,
        format: 'text',
      },
      {
        headers: { accept: 'application/json', 'Content-Type': 'application/json' },
        timeout: 15000,
      }
    );

    const translatedText = response.data?.translatedText || response.data?.translated || '';

    return res.json({ translatedText, detected });
  } catch (err) {
    console.error('Backend translation error:', err.response?.data || err.message || err);
    const status = err.response?.status || 500;
    const msg = err.response?.data?.error || 'Translation service error';
    return res.status(status).json({ error: msg });
  }
});

module.exports = router;

