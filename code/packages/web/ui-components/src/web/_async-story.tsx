"use client";

/**
 * Renders an async server-component renderer inside Storybook's client runtime.
 *
 * @see docs/reference/packages/web/ui-components/src/web/_async-story.md
 */
import { use, useMemo, type ReactNode, type DependencyList } from "react";

/**
 * Story-only helper: render an **async** renderer (QuoteList, CodeBlock) inside
 * Storybook's client runtime. Storybook doesn't resolve async server components
 * on its own, so we call the component as a function (→ a promise of its JSX)
 * and unwrap it with React 19's `use()`. Wrap the story in `<Suspense>`.
 *
 *   render: (args) => (
 *     <Suspense fallback={null}>
 *       <Async produce={() => CodeBlock(args)} deps={[JSON.stringify(args.value)]} />
 *     </Suspense>
 *   )
 */
export function Async({
  produce,
  deps,
}: {
  produce: () => Promise<ReactNode>;
  deps: DependencyList;
}) {
  // Cache the promise so `use()` doesn't re-invoke on every render; a new
  // promise is created only when `deps` change (e.g. controls edited).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const promise = useMemo(produce, deps);
  return use(promise);
}
