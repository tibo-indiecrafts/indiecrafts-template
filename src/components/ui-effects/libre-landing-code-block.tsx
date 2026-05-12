"use client";

import { cn } from "@/lib/utils";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { JSX, useLayoutEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { codeToHast, type BundledLanguage } from "shiki/bundle/web";

export async function highlight(code: string, lang: BundledLanguage, theme?: string) {
  const hast = await codeToHast(code, {
    lang,
    theme: theme || "github-dark",
  });

  return toJsxRuntime(hast, {
    Fragment,
    jsx,
    jsxs,
  }) as JSX.Element;
}

type Props = {
  code: string | null;
  lang: BundledLanguage;
  initial?: JSX.Element;
  preHighlighted?: JSX.Element | null;
  maxHeight?: number;
  className?: string;
  theme?: string;
  lineNumbers?: boolean; // ← added
};

export default function CodeBlock({
  code,
  lang,
  initial,
  maxHeight,
  preHighlighted,
  theme,
  className,
}: Props) {
  const [content, setContent] = useState<JSX.Element | null>(
    preHighlighted || initial || null,
  );

  useLayoutEffect(() => {
    // If we have pre-highlighted content, skip effect
    if (preHighlighted) {
      return;
    }

    let isMounted = true;

    if (code) {
      highlight(code, lang, theme).then((result) => {
        if (isMounted) setContent(result);
      });
    } else {
      // Use setTimeout to avoid synchronous setState in effect
      Promise.resolve().then(() => {
        if (isMounted)
          setContent(<pre className="rounded-lg bg-zinc-950 p-4">No code available</pre>);
      });
    }

    return () => {
      isMounted = false;
    };
  }, [code, lang, theme, preHighlighted]);

  return (
    <div
      className={cn(
        "*:text-[11px]/5! [&_code]:font-mono [&_pre]:max-h-(--pre-max-height) [&_pre]:min-h-128 [&_pre]:overflow-x-hidden [&_pre]:overflow-y-auto [&_pre]:border-l [&_pre]:bg-transparent! [&_pre]:py-3 [&_pre]:leading-snug",
        // Wrap long lines instead of horizontal scroll
        "[&_code]:break-words [&_pre]:whitespace-pre-wrap",
        // Line numbers via CSS counters on Shiki's .line spans
        "[&_.line]:before:mr-4 [&_.line]:before:inline-block [&_.line]:before:w-5 [&_.line]:before:text-right [&_.line]:before:text-zinc-500/60 [&_.line]:before:content-[counter(line)] [&_.line]:before:[counter-increment:line] [&_pre_code]:[counter-reset:line]",
        className,
      )}
      style={{ "--pre-max-height": `${maxHeight}px` } as React.CSSProperties}
    >
      {content ? (
        content
      ) : (
        <pre className="flex size-full items-center justify-center p-4">Loading...</pre>
      )}
    </div>
  );
}
