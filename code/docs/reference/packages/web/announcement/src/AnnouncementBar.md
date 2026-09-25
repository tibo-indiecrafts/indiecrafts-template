---
title: "Announcement bar"
description: "The dismissible announcement / discount strip rendered under the site navigation."
status: stable
---

# Announcement bar

> A non-fixed announcement strip under the nav that rotates items and remembers its dismissal.

## Purpose

The announcement / discount strip that sits at the top of `<main>`, under the site navigation. It is non-fixed, so page content flows below it and a dismiss reclaims the space by unmounting. It rotates through multiple items and stays static for a single one. The layout renders it only when the `announcement-ack` cookie differs from the current `version` (decided server-side, no flash); the same cookie is also read client-side so the client-gated surfaces stay dismissed across a reload. It is i18n-agnostic — copy arrives as props.

## Exports

- `AnnouncementBar(props)` — the client component; takes `items`, an optional `variant`, `dismissible`, the content `version`, and the localized chrome labels.

## Usage

```tsx
import { AnnouncementBar } from "@indiecrafts/packages-web-announcement/AnnouncementBar";

<AnnouncementBar
  items={banner.items}
  variant={banner.variant}
  dismissible={banner.dismissible}
  version={banner.version}
  regionLabel={t("announcement.region")}
  dismissLabel={t("announcement.dismiss")}
/>;
```

## Source

`code/packages/web/announcement/src/AnnouncementBar.tsx`
