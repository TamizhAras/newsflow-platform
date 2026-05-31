# Render Service V2

## Endpoint

POST /convert-v2

## Input

{
"scenes": [
{
"image": "base64",
"duration": 6
}
],
"script": "string",
"lang": "en"
}

## Processing

1. Save all scene images
2. Generate narration audio
3. Create individual video clips
4. Concatenate clips
5. Add narration
6. Export MP4

## Output

video/mp4

## Target

Vertical YouTube Shorts

768x1376

20-45 seconds
