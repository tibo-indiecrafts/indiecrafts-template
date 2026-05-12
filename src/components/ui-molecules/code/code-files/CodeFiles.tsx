"use client";

import { Braces, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CodeBlock } from "@/components/ui-molecules/code/code-block";

const USERS_JSON = `{
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
        },
        {
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

const RESPONSE_JSON = `{
    "status": "success",
    "code": 200,
    "data": {
        "products": [
            {
                "id": "p-123",
                "name": "Premium Headphones",
                "price": 149.99,
                "stock": 45,
                "categories": ["electronics", "audio"]
            },
            {
                "id": "p-456",
                "name": "Wireless Keyboard",
                "price": 89.99,
                "stock": 23,
                "categories": ["electronics", "accessories"]
            },
            {
                "id": "p-789",
                "name": "Smart Watch",
                "price": 199.99,
                "stock": 12,
                "categories": ["electronics", "wearables"]
            }
        ],
        "pagination": {
            "total": 3,
            "page": 1,
            "limit": 10
        }
    }
}`;

type Tab = {
  id: string;
  label: string;
  Icon: LucideIcon;
  code: string;
};

const TABS: readonly Tab[] = [
  { id: "users", label: "users.json", Icon: Braces, code: USERS_JSON },
  { id: "response", label: "response.json", Icon: Braces, code: RESPONSE_JSON },
];

/**
 * Code-files molecule — IDE-style file-tab code viewer. Clickable
 * file tabs (`users.json`, `response.json`) styled with curved
 * L-shape transitions: the active tab's underside merges into the
 * editor pane via two `bg-card` semi-circles cut at the corners
 * (and a different shape for the first vs subsequent tabs so the
 * left edge of the row is square). The editor below renders JSON
 * with line numbers via `CodeBlock`.
 *
 * Pure decoration; mock JSON stays hardcoded per the illustration
 * rule. Sourced from `@tailark-pro/code-demo-04`.
 */
export default function CodeFiles() {
  const [activeId, setActiveId] = useState(TABS[0].id);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const button = tabRefs.current[activeId];
    const parent = button?.parentElement;
    if (!button || !parent) return;
    const parentLeft = parent.getBoundingClientRect().left;
    const buttonLeft = button.getBoundingClientRect().left;
    setIndicator({
      left: buttonLeft - parentLeft + 16,
      width: button.offsetWidth,
    });
  }, [activeId]);

  const activeTab = TABS.find((t) => t.id === activeId) ?? TABS[0];
  const isFirst = activeId === TABS[0].id;

  return (
    <div className="ring-border-illustration bg-card relative z-10 overflow-hidden rounded-2xl border border-transparent px-1 pb-1 shadow-lg ring-1 shadow-black/6.5 backdrop-blur [--code-editor-background:var(--color-illustration)]">
      <div className="relative h-10">
        <div className="flex h-full items-center gap-1">
          {TABS.map((tab) => {
            const Icon = tab.Icon;
            return (
              <button
                key={tab.id}
                type="button"
                ref={(el) => {
                  tabRefs.current[tab.id] = el;
                }}
                onClick={() => setActiveId(tab.id)}
                data-state={activeId === tab.id ? "active" : ""}
                className="not-data-[state=active]:focus-visible:bg-foreground/5 not-data-[state=active]:hover:bg-foreground/5 text-foreground/75 relative z-10 flex h-8 items-center gap-1.5 rounded-lg px-3 font-mono text-xs outline-none first:rounded-tl-xl"
              >
                <Icon className="size-3 text-amber-600" aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <div
          className="absolute top-1 -bottom-px -translate-x-4 rounded-t-xl border-x border-t bg-(--code-editor-background)"
          style={{ left: indicator.left, width: `${indicator.width}px` }}
        >
          {isFirst ? (
            <div className="absolute -bottom-4 -left-px size-4 border-l bg-(--code-editor-background)" />
          ) : (
            <div className="absolute bottom-0 -left-4 size-4 bg-(--code-editor-background)">
              <div className="bg-card absolute inset-0 rounded-br-xl border-r border-b" />
            </div>
          )}

          <div className="absolute -right-4 bottom-0 size-4 bg-(--code-editor-background)">
            <div className="bg-card absolute inset-0 rounded-bl-xl border-b border-l" />
          </div>
        </div>
      </div>

      <div className="h-96 rounded-xl border bg-(--code-editor-background)">
        <div className="h-full overflow-auto mask-y-from-80% scheme-dark">
          <CodeBlock
            code={activeTab.code}
            lang="json"
            maxHeight={360}
            lineNumbers
            className="-mx-1 [&_pre]:h-fit [&_pre]:min-h-[12rem] [&_pre]:rounded-xl [&_pre]:border-none [&_pre]:!bg-transparent [&_pre]:pb-0"
          />
        </div>
      </div>
    </div>
  );
}
