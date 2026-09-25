---
title: "Filename sanitiser"
description: "Sanitises a filename and crops it by UTF-8 byte length so it stays path-safe and within filesystem limits."
status: stable
---

# Filename sanitiser

> Path-safe filenames, cropped by byte length so a multi-byte character is never split.

## Purpose

Keeps a filename inside filesystem limits (255 bytes per component on macOS/Linux) while staying readable. It strips the path, replaces unsafe characters, preserves the extension, and crops the base name by UTF-8 byte length. Zero dependencies.

## Exports

- `sanitizeAndCropFilename(filename, maxLength?)` — returns a path-safe filename within the byte budget; preserves the extension and falls back to `unnamed` when nothing survives.
- `validateFilenameLength(filename)` — reports whether a filename is within the byte limit, with the measured `byteLength`, `maxBytes`, and an `error` message when invalid.

## Usage

```ts
import {
  sanitizeAndCropFilename,
  validateFilenameLength,
} from "@indiecrafts/packages-shared-utils/filename";

sanitizeAndCropFilename("../../path/to/file with spaces.jpg");
// "file_with_spaces.jpg"

validateFilenameLength("photo.jpg");
// { valid: true, byteLength: 9, maxBytes: 200 }
```

## Source

`code/packages/shared/utils/src/filename.ts`
