---
title: "Author bio"
description: 'Renders one author card per resolved author for the end-of-article "Written by" block.'
status: stable
---

# Author bio

> End-of-article "Written by" author cards.

## Purpose

Renders the end-of-article "Written by" block. It shows one card per author with an avatar, name, optional role, and short bio. Entries without a name are dropped, and the block renders nothing when none remain.

## Exports

- `AuthorBio` — the "Written by" section; renders one card per named author.
- `AuthorBioItem` — the resolved author shape (name, role, bio, imageUrl, href).

## Usage

```tsx
import { AuthorBio } from "@indiecrafts/packages-web-ui-components/web/collection/AuthorBio";

<AuthorBio
  label="Written by"
  authors={[
    {
      name: "Ada Lovelace",
      role: "Engineer",
      bio: "Writes about compilers.",
      href: "/team/ada",
    },
  ]}
/>;
```

## Source

`code/packages/web/ui-components/src/web/collection/AuthorBio.tsx`
