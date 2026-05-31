/**
 * FFmpeg + Google TTS Microservice — Railway.app
 *
 * POST /convert
 *   Body: { pngBase64, script, theme, duration }
 *   Returns: MP4 binary
 *
 * POST /health → { status: 'ok' }
 */

const express = require('express');
const { execSync } = require('child_process');
const https = require('https');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(express.json({ limit: '25mb' }));

const PORT = process.env.PORT || 3000;
const GOOGLE_TTS_KEY = process.env.GOOGLE_TTS_KEY || '';

// Tamil voice per theme — different voices add variety
const THEME_VOICES = {
  crime:    { languageCode: 'ta-IN', name: 'ta-IN-Wavenet-A', speakingRate: 0.92 },
  accident: { languageCode: 'ta-IN', name: 'ta-IN-Wavenet-B', speakingRate: 0.94 },
  politics: { languageCode: 'ta-IN', name: 'ta-IN-Wavenet-A', speakingRate: 0.96 },
  disaster: { languageCode: 'ta-IN', name: 'ta-IN-Wavenet-B', speakingRate: 0.90 },
  arrest:   { languageCode: 'ta-IN', name: 'ta-IN-Wavenet-A', speakingRate: 0.93 },
};

// English fallback voices (if Tamil TTS not available)
const EN_VOICES = {
  crime:    { languageCode: 'en-IN', name: 'en-IN-Wavenet-B', speakingRate: 0.91 },
  accident: { languageCode: 'en-IN', name: 'en-IN-Wavenet-C', speakingRate: 0.93 },
  politics: { languageCode: 'en-IN', name: 'en-IN-Wavenet-A', speakingRate: 0.95 },
  disaster: { languageCode: 'en-IN', name: 'en-IN-Wavenet-D', speakingRate: 0.90 },
  arrest:   { languageCode: 'en-IN', name: 'en-IN-Wavenet-B', speakingRate: 0.92 },
};

app.get('/', (req, res) => res.json({ status: 'ok', service: 'news-card-converter-v3' }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/convert', async (req, res) => {
  const { pngBase64, script, theme = 'crime', duration = 30, lang = 'en' } = req.body;

  if (!pngBase64) return res.status(400).json({ error: 'pngBase64 required' });

  const id = crypto.randomBytes(8).toString('hex');
  const tmp = os.tmpdir();
  const pngPath = path.join(tmp, `card_${id}.png`);
  const mp3Path = path.join(tmp, `audio_${id}.mp3`);
  const mp4Path = path.join(tmp, `short_${id}.mp4`);
  const hasAudio = !!(script && GOOGLE_TTS_KEY);

  try {
    // 1. Write PNG
    fs.writeFileSync(pngPath, Buffer.from(pngBase64, 'base64'));

    // 2. Generate TTS via Google Cloud if key + script provided
    if (hasAudio) {
      const voices = lang === 'ta' ? THEME_VOICES : EN_VOICES;
      const voice  = voices[theme] || voices.crime;

      const ttsPayload = JSON.stringify({
        input: { text: script },
        voice,
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: voice.speakingRate,
          pitch: -1.5,
          effectsProfileId: ['headphone-class-device'],
        },
      });

      const audioB64 = await new Promise((resolve, reject) => {
        const options = {
          hostname: 'texttospeech.googleapis.com',
          path: `/v1/text:synthesize?key=${GOOGLE_TTS_KEY}`,
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(ttsPayload) },
        };
        const reqTTS = https.request(options, rsp => {
          let data = '';
          rsp.on('data', d => data += d);
          rsp.on('end', () => {
            try { resolve(JSON.parse(data).audioContent); }
            catch(e) { reject(new Error('TTS parse error: ' + data.slice(0,200))); }
          });
        });
        reqTTS.on('error', reject);
        reqTTS.write(ttsPayload);
        reqTTS.end();
      });

      fs.writeFileSync(mp3Path, Buffer.from(audioB64, 'base64'));
    }

    // 3. FFmpeg — PNG → MP4 (with or without audio)
    let ffCmd;
    if (hasAudio && fs.existsSync(mp3Path)) {
      // with voice audio — duration follows the shorter of voice/set duration
      ffCmd = [
        'ffmpeg -y',
        '-loop 1 -framerate 1',
        `-i "${pngPath}"`,
        `-i "${mp3Path}"`,
        '-c:v libx264 -tune stillimage',
        '-c:a aac -b:a 128k',
        '-pix_fmt yuv420p',
        `-t ${duration}`,
        '-vf "scale=768:1376"',
        '-movflags +faststart',
        '-shortest',
        `"${mp4Path}"`,
        '2>&1',
      ].join(' ');
    } else {
      // silent — pure static card
      ffCmd = [
        'ffmpeg -y',
        '-loop 1 -framerate 1',
        `-i "${pngPath}"`,
        '-c:v libx264 -tune stillimage',
        '-pix_fmt yuv420p',
        `-t ${duration}`,
        '-vf "scale=768:1376"',
        '-an',
        '-movflags +faststart',
        `"${mp4Path}"`,
        '2>&1',
      ].join(' ');
    }

    execSync(ffCmd, { timeout: 45000 });

    // 4. Return MP4
    const mp4 = fs.readFileSync(mp4Path);
    res.set({
      'Content-Type': 'video/mp4',
      'Content-Length': mp4.length,
      'Content-Disposition': `attachment; filename="short_${id}.mp4"`,
      'X-Used-Audio': hasAudio ? 'true' : 'false',
    });
    res.send(mp4);

  } catch (err) {
    console.error('Convert error:', err.message);
    res.status(500).json({ error: err.message });
  } finally {
    [pngPath, mp3Path, mp4Path].forEach(f => { try { fs.unlinkSync(f); } catch(_){} });
  }
});

app.listen(PORT, () => console.log(`Service ready on :${PORT}`));
