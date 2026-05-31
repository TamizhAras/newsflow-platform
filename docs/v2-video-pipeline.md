# NewsFlow V2 Video Pipeline

## Input

News Article

## Editorial Engine

GPT-4.1-mini

Outputs:

* headline
* summary
* commentary
* script
* category
* newsworthinessScore
* scene1
* scene2
* scene3
* scene4
* scene5

## Image Resolver

Priority:

1. Article image
2. Pexels
3. Pixabay
4. Unsplash
5. Branded fallback image

## Scene Renderer

Generate:

* headline.html
* facts.html
* details.html
* impact.html
* cta.html

Browserless renders each scene as PNG.

## Video Builder

Render Service receives:

* scene1.png
* scene2.png
* scene3.png
* scene4.png
* scene5.png
* narration script

Outputs:

* shorts.mp4

## Distribution

YouTube Shorts

## Analytics

Google Sheets

## Notifications

Telegram
