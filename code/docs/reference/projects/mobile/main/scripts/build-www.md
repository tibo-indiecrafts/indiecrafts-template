---
title: "Shell www generator"
description: "Generates the shell's www/ folder — the offline page — from shell.json and the messages files."
status: stable
---

# Shell www generator

> Run by the shell's `www`, `sync`, `android` and `ios` scripts.

## Purpose

Reads the app name from `shell.json`, the `offline` copy from `messages/<locale>.json`, and the Retry target from `CAP_SERVER_URL` (validated by `resolveServerUrl`; required), then writes `www/offline.html` and `www/index.html` (Capacitor requires `webDir` to hold an index; with `server.url` set it is never shown). `www/` is git-ignored.

## Exports

None — a script.

## Source

`code/projects/mobile/surfaces/main/scripts/build-www.mjs`
