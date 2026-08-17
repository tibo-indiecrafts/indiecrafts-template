/**
 * Filename sanitising + UTF-8 byte-safe cropping.
 *
 * Keeps a filename inside filesystem limits (macOS/Linux: 255 bytes per
 * component) while staying readable: strips the path, replaces unsafe chars,
 * preserves the extension, and crops the base name by BYTE length (not char
 * count) so a multi-byte character is never split. Zero dependencies.
 */

/** Byte budget for the whole filename — 200 leaves room for prefixes/suffixes. */
const MAX_FILENAME_BYTES = 200;
/** Default char cap for the base name before the extension. */
const MAX_BASE_FILENAME_LENGTH = 80;

const utf8 = new TextEncoder();

function byteLength(str: string): number {
  return utf8.encode(str).length;
}

/** Longest prefix of `str` that fits in `maxBytes` UTF-8 bytes (binary search). */
function cropToByteLength(str: string, maxBytes: number): string {
  if (byteLength(str) <= maxBytes) return str;

  let left = 0;
  let right = str.length;
  let result = "";
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const candidate = str.slice(0, mid);
    if (byteLength(candidate) <= maxBytes) {
      result = candidate;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return result;
}

function sanitizeComponent(filename: string): string {
  return filename
    .replace(/^.*[/\\]/, "") // drop any path
    .replace(/[^a-zA-Z0-9._-]/g, "_") // unsafe chars → underscore
    .replace(/_{2,}/g, "_") // collapse runs
    .replace(/^_+|_+$/g, ""); // trim underscores
}

function getExtension(filename: string): string {
  return filename.match(/\.[^.]+$/)?.[0] ?? "";
}

/**
 * Sanitize + crop a filename so it is path-safe and within byte limits.
 * Preserves the extension; falls back to `unnamed` when nothing survives.
 *
 * @example sanitizeAndCropFilename("../../path/to/file with spaces.jpg") // "file_with_spaces.jpg"
 */
export function sanitizeAndCropFilename(filename: string, maxLength = MAX_BASE_FILENAME_LENGTH): string {
  if (!filename) return "unnamed";

  const extension = getExtension(filename);
  const base = sanitizeComponent(filename.replace(/\.[^.]*$/, ""));
  if (!base) return `unnamed${extension || ".bin"}`;

  let cropped = base.length > maxLength ? base.slice(0, maxLength) : base;
  if (byteLength(`${cropped}${extension}`) > MAX_FILENAME_BYTES) {
    cropped = cropToByteLength(cropped, MAX_FILENAME_BYTES - byteLength(extension));
  }
  return `${cropped}${extension}`;
}

/** Report whether `filename` is within the byte limit, with the measured length. */
export function validateFilenameLength(filename: string): {
  valid: boolean;
  byteLength: number;
  maxBytes: number;
  error?: string;
} {
  const bytes = byteLength(filename);
  if (bytes > MAX_FILENAME_BYTES) {
    return {
      valid: false,
      byteLength: bytes,
      maxBytes: MAX_FILENAME_BYTES,
      error: `Filename exceeds maximum byte length (${bytes} > ${MAX_FILENAME_BYTES})`,
    };
  }
  return { valid: true, byteLength: bytes, maxBytes: MAX_FILENAME_BYTES };
}
