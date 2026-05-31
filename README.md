# NewsFlow Platform

AI-powered news automation platform that transforms breaking news into engaging multi-scene YouTube Shorts.

## Overview

NewsFlow Platform automatically:

* Collects news from RSS feeds
* Filters and deduplicates articles
* Generates original editorial commentary using GPT
* Uses article images with free stock-image fallback
* Builds multi-scene visual stories
* Creates voice narration using Google Text-to-Speech
* Renders vertical videos using FFmpeg
* Publishes directly to YouTube
* Logs analytics to Google Sheets
* Sends notifications via Telegram

The platform is designed to produce high-quality news shorts while keeping operational costs extremely low.

---

## Architecture

```text
News Sources
     ↓
Article Collection
     ↓
Deduplication
     ↓
GPT Editorial Engine
     ↓
Image Resolver
     ↓
Scene Generator
     ↓
Screenshot Renderer
     ↓
FFmpeg Video Builder
     ↓
YouTube Publisher
     ↓
Analytics & Monitoring
```

---

## Features

### Editorial Engine

* GPT-4.1-mini powered
* Original commentary generation
* Category detection
* Headline creation
* Viewer engagement prompts

### Image Strategy

Priority order:

1. Article image
2. Pexels
3. Pixabay
4. Unsplash

No paid AI image generation required.

### Video Production

* Multi-scene storytelling
* Dynamic layouts
* Zoom and pan effects
* Crossfade transitions
* Vertical Shorts format

### Automation

* Fully automated workflow
* Duplicate prevention
* Scheduled publishing
* Analytics tracking
* Telegram notifications

---

## Technology Stack

### Infrastructure

* GitHub
* Cloudflare Pages
* Railway
* Browserless

### AI

* OpenAI GPT-4.1-mini

### Media

* FFmpeg
* Google Text-to-Speech

### Automation

* n8n

### Storage

* Google Sheets

### Distribution

* YouTube Data API

---

## Repository Structure

```text
newsflow-platform/

├── ffmpeg-service/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
│
├── templates/
│   ├── headline.html
│   ├── image.html
│   ├── facts.html
│   ├── impact.html
│   └── cta.html
│
├── n8n/
│   └── workflow.json
│
├── docs/
│   ├── deployment-guide.md
│   ├── architecture.md
│   └── operations.md
│
└── README.md
```

---

## Deployment Roadmap

### Phase 1

Infrastructure Setup

* GitHub
* Cloudflare Pages
* Railway
* Browserless
* Google Cloud
* OpenAI

### Phase 2

GPT Editorial Engine

### Phase 3

Image Resolver

### Phase 4

Scene Templates

### Phase 5

Video Rendering

### Phase 6

YouTube Publishing

### Phase 7

Analytics & Monitoring

---

## Cost Estimate

| Service             | Monthly Cost |
| ------------------- | ------------ |
| OpenAI GPT-4.1-mini | ₹100–₹300    |
| Railway             | ₹0–₹200      |
| Cloudflare Pages    | ₹0           |
| Browserless         | ₹0           |
| Google Sheets       | ₹0           |
| Google TTS          | ₹0           |
| YouTube API         | ₹0           |

Estimated Total:

₹100–₹500/month

---

## Status

🚧 Under Development

Current Version: V4 Architecture
