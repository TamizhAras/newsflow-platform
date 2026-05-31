# NewsFlow Project Context

## Project Overview

NewsFlow is an automated YouTube Shorts news platform.

The goal is to automatically discover news articles, transform them into engaging short-form news content, generate videos, and publish them to YouTube Shorts with minimal human intervention.

This project originally started as a Tamil Nadu crime news automation workflow but has evolved into a global multi-category news platform.

---

# Core Vision

Input:

News Article

Output:

YouTube Shorts Video

Pipeline:

Article
↓
Editorial Engine (GPT)
↓
Scene Generation
↓
Image Resolution
↓
Browserless Rendering
↓
Video Generation
↓
YouTube Publishing

---

# Technology Stack

## AI

* OpenAI GPT-4.1-mini (target model)
* OpenAI API

## Automation

* n8n

## Rendering

* Browserless
* HTML Templates
* FFmpeg

## Hosting

* Render

## Source Data

* RSS Feeds
* Google News RSS

## Publishing

* YouTube Data API

---

# Current Architecture

Current production architecture:

RSS
↓
Article Parsing
↓
Claude AI
↓
Single Card Screenshot
↓
FFmpeg Service
↓
YouTube

This architecture is considered V1 and is being replaced.

---

# Target Architecture (V2)

RSS
↓
Article Parsing
↓
OpenAI Editorial Engine
↓
5 Scene Templates
↓
Browserless Screenshots
↓
Render Service V2
↓
YouTube Shorts

---

# Editorial Engine

The Editorial Engine is the central component of the platform.

Input:

* Article title
* Article content

Output:

{
"headline": "",
"shortHeadline": "",
"summary": "",
"commentary": "",
"script": "",
"category": "",
"importance": "",
"newsworthinessScore": 0,
"estimatedVideoDuration": 0,
"keywords": [],
"imageSearchTerms": [],
"scene1": {},
"scene2": {},
"scene3": {},
"scene4": {},
"scene5": {},
"youtubeTitle": "",
"youtubeDescription": "",
"hashtags": []
}

The schema is defined in:

prompts/editorial-schema.json

The prompt is defined in:

prompts/editorial-prompt.md

The API request contract is defined in:

prompts/openai-request-example.json

---

# Scene Structure

The platform uses 5 scenes.

Scene 1:
Breaking News

Scene 2:
What Happened

Scene 3:
Key Details

Scene 4:
Why It Matters

Scene 5:
Viewer Question / CTA

Each scene will become a rendered PNG image.

---

# Image Strategy

Priority:

1. Article image
2. Pexels
3. Pixabay
4. Unsplash
5. Branded fallback image

No AI image generation is planned.

Reason:

* Lower cost
* Better news authenticity
* Simpler licensing

---

# Video Style Guide

Format:

768x1376

Platform:

YouTube Shorts

Target Duration:

20-45 seconds

Transitions:

Crossfade

Motion:

Ken Burns style slow zoom

Narration:

Google TTS

Audio:

Voice only

No background music in V1.

---

# Render Service

Current:

Single image rendering.

Input:

{
"pngBase64": "...",
"script": "...",
"duration": 30
}

Current server:

ffmpeg-service/server.js

Current service only supports:

1 image
+
1 narration
+
1 video

---

# Render Service V2

Planned endpoint:

POST /convert-v2

Request:

{
"scenes": [
{
"url": "...",
"duration": 6
}
],
"script": "...",
"lang": "en"
}

Features:

* Multi-scene rendering
* Crossfade transitions
* Ken Burns zoom effect
* Google TTS narration
* Vertical Shorts export

Design document:

docs/render-service-v2.md

---

# Browserless Strategy

HTML Templates
↓
Browserless
↓
PNG Images

Current template files:

templates/headline.html
templates/happened.html
templates/details.html
templates/impact.html
templates/cta.html

Current implementation status:

Prototype only.

Needs:

* Shared CSS
* Dynamic variable replacement
* Browserless integration

---

# OpenAI Migration

Claude is being removed.

Target:

OpenAI GPT-4.1-mini

The first implementation milestone is:

editor/openai-editor.js

Responsibilities:

1. Load editorial prompt
2. Load schema
3. Accept article input
4. Call OpenAI
5. Validate JSON
6. Save editorial-response.json

---

# Current Repository Status

Completed:

* Render deployment
* OpenAI account setup
* OpenAI API key
* Editorial schema
* Editorial prompt
* OpenAI request example
* V2 architecture documents
* Scene template placeholders

Pending:

* OpenAI Editorial Engine implementation
* Image Resolver
* Browserless integration
* Render Service V2
* n8n migration
* YouTube publishing improvements

---

# Development Priorities

Priority 1

OpenAI Editorial Engine

Priority 2

Image Resolver

Priority 3

Browserless Scene Rendering

Priority 4

Render Service V2

Priority 5

n8n Workflow Migration

---

# Important Constraints

* Keep infrastructure costs extremely low.
* Prefer free tiers whenever possible.
* Avoid AI image generation.
* Minimize API calls.
* Reuse existing Render deployment.
* Maintain simple architecture.
* Favor reliability over visual complexity.

---

# Success Definition

A news article enters the workflow and automatically produces:

1. Editorial JSON
2. Five rendered scene images
3. Narrated Shorts video
4. Published YouTube Shorts video

with minimal human intervention.
