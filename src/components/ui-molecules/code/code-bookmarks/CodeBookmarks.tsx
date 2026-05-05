"use client";

import { Braces } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { CodeBlock } from "@/components/ui-molecules/code/code-block";

const JSON_CODE_PART_1 = `{
    "users": [
        {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "age": 30,
            "cart": [
                {
                    "id": 1,
                    "name": "Product 1",
                    "price": 10
                },
                {
                    "id": 2,
                    "name": "Product 2",
                    "price": 20
                }
            ]
        },`;

const JSON_CODE_PART_2 = `        {
            "name": "Jane Smith",
            "email": "jane.smith@example.com",
            "age": 25,
            "cart": [
                {
                    "id": 1,
                    "name": "Product 1",
                    "price": 10
                },
                {
                    "id": 2,
                    "name": "Product 2",
                    "price": 20
                }
            ]
        }
    ]
}`;

const AVATARS = [
  {
    src: "https://avatars.githubusercontent.com/u/47919550?v=4",
    alt: "Méschac Irung",
    target: "first",
  },
  {
    src: "https://avatars.githubusercontent.com/u/31113941?v=4",
    alt: "Bernard Ngandu",
    target: "second",
  },
] as const;

/**
 * Code-bookmarks molecule — JSON file viewer with avatar bookmarks.
 * Two stacked `CodeBlock` instances render parts 1 and 2 of a single
 * logical JSON file (split so each user's cart fits on screen). Two
 * avatar buttons in the top-right (Méschac, Bernard) scroll-into-view
 * to their corresponding section. The second CodeBlock continues line
 * numbering from line 20 via `[--counter-start:20]` (handled by the
 * `CodeBlock.css` line-number counter).
 *
 * The header chrome mocks an editor-tab look: a "response.json"
 * filename label on the left + a tab-cutout silhouette around the
 * avatar buttons. Pure decoration; mock JSON stays hardcoded per the
 * illustration rule.
 */
export default function CodeBookmarks() {
  const firstCodeRef = useRef<HTMLDivElement>(null);
  const secondCodeRef = useRef<HTMLDivElement>(null);

  const scrollTo = (target: "first" | "second") => {
    const el = target === "first" ? firstCodeRef.current : secondCodeRef.current;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <div className="ring-border bg-card relative z-10 overflow-hidden rounded-2xl border border-transparent p-1 shadow-lg ring-1 shadow-black/6.5 backdrop-blur [--code-editor-background:var(--color-illustration)]">
      <div className="absolute top-0 right-1 z-10 flex h-9 w-fit translate-y-px items-center -space-x-2">
        {AVATARS.map((avatar) => (
          <button
            key={avatar.alt}
            type="button"
            onClick={() => scrollTo(avatar.target)}
            aria-label={`Scroll to ${avatar.alt}'s data`}
            className="group my-auto flex size-8 rounded-xl duration-200 active:scale-90"
          >
            <div className="bg-background m-auto size-5 rounded-full shadow shadow-zinc-950/5 transition-all duration-200 *:rounded-full group-focus:ring-2 group-focus:ring-indigo-400">
              <Image
                src={avatar.src}
                className="aspect-square rounded-[calc(var(--avatar-radius)-2px)] object-cover"
                alt={avatar.alt}
                width={52}
                height={52}
              />
            </div>
          </button>
        ))}
      </div>

      <div className="absolute right-1 left-0 grid h-9 grid-cols-[auto_1fr]">
        <div className="pl-6">
          <div className="text-foreground/75 flex h-full items-center gap-1.5 font-mono text-xs">
            <Braces className="size-3 text-amber-600" aria-hidden="true" />
            response.json
          </div>
        </div>
        <div className="grid h-full grid-cols-[auto_1fr_auto]">
          <div className="bg-card h-1/2 w-5 translate-px -translate-y-px">
            <div className="mt-px h-full rounded-tr-xl border-t border-r bg-(--code-editor-background)" />
          </div>
          <div className="bg-card h-full rounded-bl-xl border-b border-l" />
          <div className="bg-card h-full w-5">
            <div className="bg-card h-1/2 translate-y-[200%]">
              <div className="-mt-px h-full rounded-tr-xl border-t border-r bg-(--code-editor-background)" />
            </div>
          </div>
        </div>
      </div>

      <div className="h-96 rounded-xl border bg-(--code-editor-background) pt-9">
        <div className="h-full overflow-auto mask-y-from-80% scheme-dark">
          <div ref={firstCodeRef}>
            <CodeBlock
              code={JSON_CODE_PART_1}
              lang="json"
              maxHeight={360}
              lineNumbers
              className="-mx-1 [&_pre]:h-fit [&_pre]:min-h-[12rem] [&_pre]:rounded-xl [&_pre]:border-none [&_pre]:!bg-transparent [&_pre]:pb-0"
            />
          </div>
          <div ref={secondCodeRef}>
            <CodeBlock
              code={JSON_CODE_PART_2}
              lang="json"
              maxHeight={360}
              lineNumbers
              className="-mx-1 [--counter-start:20] [&_pre]:h-fit [&_pre]:!bg-transparent [&_pre]:pt-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
