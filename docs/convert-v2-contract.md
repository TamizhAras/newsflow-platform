# Convert V2 Contract

POST /convert-v2

Request

{
"scenes": [
{
"url": "https://example.com/scene1.png",
"duration": 6
},
{
"url": "https://example.com/scene2.png",
"duration": 6
},
{
"url": "https://example.com/scene3.png",
"duration": 6
},
{
"url": "https://example.com/scene4.png",
"duration": 6
},
{
"url": "https://example.com/scene5.png",
"duration": 6
}
],
"script": "Narration text",
"lang": "en"
}

Response

video/mp4

Effects

* Ken Burns zoom
* Crossfade transition
* Google TTS narration
* Vertical Shorts format
