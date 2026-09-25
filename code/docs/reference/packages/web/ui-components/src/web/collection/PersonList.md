---
title: "Person list"
description: "Renders a team grid of people with avatar, name, and role."
status: stable
---

# Person list

> A team grid of people.

## Purpose

Renders a `module.person-list` team block: a compact grid of people, each with a rounded-square avatar, name, and role. It drops entries the client could not resolve and renders nothing when none remain.

## Exports

- `PersonList` — a team grid of avatars with name and role.

## Usage

```tsx
import { PersonList } from "@indiecrafts/packages-web-ui-components/web/collection/PersonList";

<PersonList {...module} />;
```

## Source

`code/packages/web/ui-components/src/web/collection/PersonList.tsx`
