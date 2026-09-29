---
title: "Shell link routing"
description: "Pure helpers that decide which links leave the Capacitor shell and map deep links to app routes."
status: stable
---

# Shell link routing

> Which link opens the system browser, and where a deep link lands.

## Purpose

Two pure, tested helpers used by `NativeBridge`. `isExternalUrl` returns true only for an absolute `http(s)` URL on another origin — legal pages on the website and external sites open in the system browser; relative, same-origin, hash, `mailto:`/`tel:` and malformed hrefs stay in the web view. `deepLinkPath` turns a custom-scheme link (`<scheme>://account?tab=data`) into an in-app path (`/account?tab=data`), with `/` as the fallback for an empty or malformed link.

## Exports

- `isExternalUrl(href, appOrigin)` — true when the link must leave the shell.
- `deepLinkPath(url)` — the in-app path for a deep link.

## Source

`code/projects/web/surfaces/app/src/lib/shell-links.ts`
