# Tamil News → YouTube Shorts v3 — Setup Guide
## Anti-Flag Edition: Dynamic Themes · Original Voice · Tamil TTS

---

## What's New in v3 (vs v2)

| Flag Fixed | How |
|---|---|
| Same template every time | 5 colour themes × 3 layouts = 15 visual combinations, Claude picks per story |
| No original commentary | Claude writes 2-3 sentences of original community-perspective content |
| No human voice | Google Cloud TTS with Tamil/Indian-accented voice (en-IN or ta-IN) |
| Reused content wording | Claude prompt explicitly forbids copying source sentences |
| Bot posting pattern | Random 0–18 min delay node added before RSS fetch |
| Hidden source | "Source: X" watermark visible on card bottom-right |

---

## Files in This Package

| File | Purpose |
|---|---|
| `n8n-workflow-v3.json` | Import into n8n |
| `card-template.html` | Host on Cloudflare Pages |
| `ffmpeg-service/` | Deploy to Railway |
| `SETUP-GUIDE.md` | This file |

---

## Accounts & Keys Needed

| Service | Purpose | Cost | Link |
|---|---|---|---|
| Claude API (Haiku) | AI enrichment + script | ~$0.001/article | console.anthropic.com |
| Google Cloud TTS | Indian-accent voice | Free 1M chars/month | console.cloud.google.com |
| Browserless.io | Screenshot card | Free 1000/month | browserless.io |
| Railway.app | FFmpeg + TTS service | Free tier | railway.app |
| YouTube Data API | Upload Shorts | Free | console.cloud.google.com |
| Google Sheets API | Dedup log | Free | console.cloud.google.com |
| Cloudflare Pages | Host card template | Free | pages.cloudflare.com |
| n8n Cloud | Workflow orchestration | Free tier | n8n.io |
| Telegram Bot | Notifications | Free | @BotFather |

**Estimated monthly cost at 15 Shorts/day: ~$0.45 (Claude API only)**

---

## Step 1 — Deploy card-template.html to Cloudflare Pages

1. Create a GitHub repo, add `card-template.html` to root
2. Go to [pages.cloudflare.com](https://pages.cloudflare.com) → Create a project → Connect GitHub repo
3. Build command: (leave blank) · Output directory: (leave blank)
4. Deploy → your URL: `https://your-project.pages.dev/card-template.html`

Test it:
```
https://your-project.pages.dev/card-template.html?headline=TEST&theme=crime&variant=1
https://your-project.pages.dev/card-template.html?headline=TEST&theme=politics&variant=2
https://your-project.pages.dev/card-template.html?headline=TEST&theme=disaster&variant=3
```
Each should look visually distinct.

---

## Step 2 — Deploy FFmpeg Service to Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Push the `ffmpeg-service/` folder as its own repo (or monorepo)
3. Railway auto-detects the Dockerfile and builds it
4. Add environment variable: `GOOGLE_TTS_KEY` = your Google Cloud TTS API key
5. Your service URL: `https://your-app.railway.app`

Test it:
```bash
curl -X GET https://your-app.railway.app/health
# Should return: {"status":"ok","service":"news-card-converter-v3"}
```

---

## Step 3 — Enable Google Cloud TTS

1. Go to console.cloud.google.com → APIs & Services → Enable "Cloud Text-to-Speech API"
2. Create an API Key (not OAuth — just a simple API key)
3. Restrict the key to "Cloud Text-to-Speech API" only
4. Paste this key into Railway as `GOOGLE_TTS_KEY` environment variable

**Voice used:** `en-IN-Wavenet-B/C/D` (Indian English accent) — rotates per theme
**Tamil voice:** Set `lang=ta` in the Railway node body to use `ta-IN-Wavenet-A/B` instead

---

## Step 4 — Create Google Sheet

Create a sheet with tab named **Posted** with these columns:

| link | url | headline | theme | variant | score | youtube_url | posted_at |

Copy the Sheet ID from the URL bar.

---

## Step 5 — Import Workflow into n8n

1. n8n → New Workflow → ••• menu → Import from file
2. Select `n8n-workflow-v3.json`
3. All 17 nodes load pre-connected

---

## Step 6 — Fill in the 6 Placeholders

Open each node and replace:

| Node | Replace | With |
|---|---|---|
| 🤖 Claude node | `YOUR_CLAUDE_API_KEY` | Your Anthropic key |
| 📋 Read Posted Log | `YOUR_GOOGLE_SHEET_ID` | Your Sheet ID |
| 📋 Log to Google Sheets | `YOUR_GOOGLE_SHEET_ID` | Your Sheet ID |
| 🔗 Build Card URL | `YOUR-PROJECT.pages.dev` | Your Cloudflare Pages URL |
| 📸 Browserless → PNG | `YOUR_BROWSERLESS_TOKEN` | Your Browserless token |
| 🎬 Railway node | `YOUR-RAILWAY-APP.railway.app` | Your Railway service URL |
| 📱 Telegram Notify | `YOUR_TELEGRAM_CHAT_ID` | Your chat ID |

---

## Step 7 — Set Up n8n Credentials

In n8n → Settings → Credentials:

**Claude API** (HTTP Header Auth)
- Header Name: `x-api-key`
- Header Value: `sk-ant-YOUR_KEY`

**YouTube OAuth2**
- Follow n8n wizard → Google OAuth
- Scopes: `youtube.upload`

**Google Sheets OAuth2**
- Same Google account

**Telegram**
- Create bot via @BotFather → paste token

---

## Step 8 — Test in Order

Test each node individually (Execute Node button):

1. ⏰ Schedule → triggers manually
2. 📡 RSS → check 5-10 articles appear
3. 🔧 Filter → only recent items pass
4. 📋 Sheets Read → returns your log (empty first time = fine)
5. 🔍 Dedup → all pass (empty sheet)
6. 🤖 Claude → check JSON has theme, variant, script fields
7. 📸 Browserless → should return PNG binary
8. 🎬 Railway → should return MP4 binary
9. ▶️ YouTube → **set privacyStatus to "private" first!**
10. 📋 Sheets Write → check row appears
11. 📱 Telegram → check notification arrives

---

## Theme & Layout Reference

| Theme | Colour | Badge | Use For |
|---|---|---|---|
| `crime` | Dark red + red neon | 🔴 CRIME ALERT | Murder, kidnap, robbery |
| `accident` | Orange + orange neon | 🟠 BREAKING | Road, rail, industrial accidents |
| `politics` | Deep blue + blue neon | 🔵 POLITICS | Elections, govt, ministers |
| `disaster` | Purple + purple neon | 🟣 ALERT | Floods, fire, earthquake |
| `arrest` | Dark green + green neon | 🟢 ARRESTED | Police arrests, raids |

| Variant | Side Box Position |
|---|---|
| 1 | Right side (default) |
| 2 | Left side |
| 3 | No side box — larger content area |

Claude picks theme + variant automatically per story. The workflow logs both to Google Sheets so you can monitor the distribution.

---

## Adjusting Posting Volume

**Current:** runs every 30 min, posts only stories scoring ≥ 7/10
**Expected output:** 3–5 Shorts/day from 48 runs (most stories score below 7)

To increase volume:
- Lower threshold: change `score < 7` to `score < 6` in 📊 Parse AI Response node
- Add more RSS sources: duplicate 📡 RSS node with different query strings

To decrease volume:
- Raise threshold to `score < 8`
- Change schedule to every 60 minutes

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Browserless returns blank PNG | Check Cloudflare Pages URL is public; verify `body.ready` fires in browser |
| Claude returns non-JSON | Code node strips fences; if still failing check API key is valid |
| Railway returns 500 | Check Railway logs; verify `GOOGLE_TTS_KEY` env var is set |
| TTS audio sounds wrong | Change `lang` param from `en` to `ta` for Tamil voice |
| YouTube upload rejected | Test with `private` first; ensure OAuth scopes include `youtube.upload` |
| Same theme every video | Claude prompt instructs variant rotation; check `forcedVariant` fallback in Parse node |
| Duplicate posts | Verify Sheet ID correct and "Posted" tab exists with right column names |
