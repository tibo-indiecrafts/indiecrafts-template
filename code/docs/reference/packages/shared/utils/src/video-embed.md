---
title: "Video embed parser"
description: "Parses a featured-video URL into a safe, provider-specific embed descriptor, rejecting unknown or unsafe input."
status: stable
---

# Video embed parser

> A validated embed descriptor from a URL — no raw iframe HTML, so there is no stored-XSS path.

## Purpose

Parses a featured-video URL into a safe, ready-to-render embed descriptor. The system stores a URL rather than raw iframe HTML and builds the player itself, so only a validated `http(s)` URL from a known provider ever reaches an iframe `src`. Unrecognized input returns `null` and the caller falls back to the cover image.

Supported providers: YouTube (including `youtu.be` and the no-cookie host), Vimeo, Dailymotion (including `dai.ly`), and direct video files (`.mp4`, `.webm`, `.ogg`, `.mov`).

## Exports

- `VideoEmbed` — the discriminated union describing a parsed embed (`youtube`, `vimeo`, `dailymotion`, or `file`), each carrying an `embedSrc`.
- `parseVideoEmbed(input?)` — parses a URL into a `VideoEmbed`, or returns `null` for unknown or unsafe input.

## Usage

```ts
import { parseVideoEmbed } from "@indiecrafts/packages-shared-utils/video-embed";

parseVideoEmbed("https://youtu.be/dQw4w9WgXcQ");
// { kind: "youtube", id: "dQw4w9WgXcQ", embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" }

parseVideoEmbed("javascript:alert(1)");
// null
```

## Source

`code/packages/shared/utils/src/video-embed.ts`
