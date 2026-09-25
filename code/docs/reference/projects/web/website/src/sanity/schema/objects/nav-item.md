---
title: "Nav item object"
description: "The Sanity object schema for one reusable menu link, internal or external, used in the header and footer."
status: stable
---

# Nav item object

> A reusable menu link — internal route or external URL.

## Purpose

Defines the `navItem` object — a single reusable menu link used in the header bar and every footer column. Two kinds toggle by `linkType`: internal points at one of the site's own pages via the `route` dropdown built from the `pages` map, and external is a full URL. Only activated routes are offered, so a link cannot target a disabled route. Header extras add an optional icon and description for rich dropdown links, plus one level of `children` submenu.

## Exports

- `default` — the `navItem` object type definition (a Sanity `defineType`).

## Source

`code/projects/web/surfaces/website/src/sanity/schema/objects/nav-item.ts`
