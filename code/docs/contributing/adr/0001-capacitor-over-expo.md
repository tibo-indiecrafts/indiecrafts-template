---
title: "ADR 0001 — Capacitor over Expo"
description: Ship mobile as a Capacitor shell around the app surface instead of a separate React Native app.
status: stable
order: 3
---

# ADR 0001 — Capacitor over Expo

**Status:** Accepted · **Date:** 2026-09-29 · **Deciders:** the maintainer

## Context

The mobile app was a separate React Native / Expo codebase. It forced a native fork into
five shared bricks, a native-only design system (`ui-native`), native-only API features
(`/v1/geo`, the `EVENTS_TOKEN` bearer, surface `mobile`) and an EAS pipeline. Every
feature shipped twice.

## Decision

Ship mobile as a Capacitor 8 shell that loads the hosted `app` surface (`server.url`).
All UI lives in the web app; one client component (`NativeBridge`) wires the native
plugins. Delete the Expo app, every native fork, and the native-only backend features.
Sign-in is password or an email code on every surface.

## Consequences

- One UI codebase. `shared/` bricks are the ones the api uses too; the rest live in `web/`.
- Web deploys update the mobile app without a store review.
- The shell needs a network; a failed first load shows a bundled offline page.
- A public App Store release needs one real native feature (Guideline 4.2) and a release
  pipeline. Both belong to a later spec, as does OAuth through the system browser.

See [Mobile shell (Capacitor)](/projects/mobile/main/).
