"use client";

import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, useLayoutEffect, useState, type JSX } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import type { BundledLanguage } from "shiki/bundle/web";
import { cn } from "@/lib/utils";

const highlightCache = new Map<string, JSX.Element>();

let shikiPromise: Promise<typeof import("shiki/bundle/web")> | null = null;

function getShiki() {
  if (!shikiPromise) {
    shikiPromise = import("shiki/bundle/web");
  }
  return shikiPromise;
}

/**
 * Lazily-loaded shiki highlighter. Memoizes the rendered JSX in a
 * 100-entry LRU keyed on `lang:length:head:tail` so re-renders of
 * the same snippet across tab switches stay free.
 */
export async function highlight(code: string, lang: BundledLanguage) {
  const cacheKey = `${lang}:${code.length}:${code.slice(0, 50)}:${code.slice(-50)}`;
  const cached = highlightCache.get(cacheKey);
  if (cached) return cached;

  const { codeToHast } = await getShiki();
  const hast = await codeToHast(code, {
    lang,
    themes: { light: "github-light", dark: "vesper" },
  });

  const result = toJsxRuntime(hast, { Fragment, jsx, jsxs }) as JSX.Element;

  if (highlightCache.size > 100) {
    const firstKey = highlightCache.keys().next().value;
    if (firstKey) highlightCache.delete(firstKey);
  }
  highlightCache.set(cacheKey, result);
  return result;
}

type Props = {
  code: string | null;
  lang: BundledLanguage;
  initial?: JSX.Element;
  preHighlighted?: JSX.Element | null;
  maxHeight?: number;
  className?: string;
  theme?: string;
  lineNumbers?: boolean;
};

/**
 * Shiki-based code-block molecule. Wraps lazy-loaded shiki/web
 * highlighting with a JSX cache so consumers can mount many
 * highlighted snippets without re-parsing each on every render.
 * Supports light / dark themes via `data-theme="dark"` (themes
 * fixed at `github-light` and `vesper` — override via the `theme`
 * prop is wired but not yet honored at the highlight layer).
 */
export default function CodeBlock({
  code,
  lang,
  initial,
  maxHeight = 940,
  preHighlighted,
  theme,
  className,
  lineNumbers,
}: Props) {
  const [content, setContent] = useState<JSX.Element | null>(
    preHighlighted ?? initial ?? null,
  );

  useLayoutEffect(() => {
    if (preHighlighted) return;

    let isMounted = true;
    if (code) {
      highlight(code, lang).then((result) => {
        if (isMounted) setContent(result);
      });
    }

    return () => {
      isMounted = false;
    };
  }, [code, lang, theme, preHighlighted]);

  return content ? (
    <div
      data-line-numbers={lineNumbers ? "" : undefined}
      className={cn(
        "[&_pre]:no-scrollbar max-h-(--pre-max-height) [&_code]:font-mono [&_code]:text-[13px]/2 [&_pre]:border-l [&_pre]:p-2 [&_pre]:leading-snug",
        className,
      )}
      style={{ "--pre-max-height": `${maxHeight}px` } as React.CSSProperties}
    >
      {content}
    </div>
  ) : (
    <pre className="rounded-lg p-4 text-xs">Loading...</pre>
  );
}
