---
title: "Form frame"
description: "The section, card, heading and success line every public form shares."
status: stable
---

# Form frame

> The block frame of every public form: section, card, heading, then the success line or the form.

## Purpose

`FormFrame` renders the outside of a form block: the `<section>` (with `anchor` as its `id`), the
`card`, `inline` or `banner` card, the heading (`headingAs`: `h3` inside a page's blocks, `h1`
when the form is the page) and the body. While `done` is false it renders `children` (the form);
once the submit succeeds it renders `success` as a polite live region. The section is a
`@container`: padding, layout and heading sizes key off its own width. The same block fits a
sidebar card, the blog column and a full-width section. The contact, waitlist,
newsletter and lead-magnet forms all use it. A client-side part: it has no `"use client"` entry,
because only the client forms render it.

## Exports

- `FormFrame({ anchor?, variant?, heading?, body?, headingAs?, done, success, children })`.
- `FormVariant` — `"card" | "inline" | "banner"`.

## Usage

See the colocated `FormFrame.md` (Storybook → UI Components/FormFrame) for the full "add a form"
recipe.

## Source

`code/packages/web/ui-components/src/web/form/FormFrame.tsx`
