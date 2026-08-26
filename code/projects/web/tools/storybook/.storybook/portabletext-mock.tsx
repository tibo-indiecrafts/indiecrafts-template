/**
 * Storybook mock for `@portabletext/react`. Real `@portabletext/react` v7 is
 * built with the React Compiler and imports the `react/compiler-runtime`
 * subpath — `@storybook/nextjs-vite`'s own react-aliasing (matching the app's
 * real Next.js React build) doesn't resolve that subpath cleanly under this
 * Storybook config's esbuild dependency pre-bundling, and the failure is
 * non-deterministic across runs (varies with which other stories share the
 * scan), crashing the WHOLE browser session — not just the story that
 * touches it. None of the website stories exercise rich-text rendering
 * itself (portable text values are transitive, several hops from what's
 * asserted on), so a no-op stub is enough. Only `PortableText` is a real
 * runtime import anywhere reachable from a website story; the rest are
 * type-only imports (erased at build) — stubbed anyway, cheaply, in case a
 * future story reaches them.
 */
import type { ReactNode } from "react";

export function PortableText(_props: {
  value?: unknown;
  components?: unknown;
  onMissingComponent?: unknown;
}): ReactNode {
  return null;
}

export const defaultComponents = {};

export function mergeComponents(...components: unknown[]): unknown {
  return Object.assign({}, ...components);
}

export function toPlainText(): string {
  return "";
}

export default { PortableText, defaultComponents, mergeComponents, toPlainText };
