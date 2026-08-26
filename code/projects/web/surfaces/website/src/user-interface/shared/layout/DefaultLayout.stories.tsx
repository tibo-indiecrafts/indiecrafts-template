import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DefaultLayout } from "./DefaultLayout";

/**
 * Production page shell — wires the Header/Footer chrome plus the announcement
 * bar, locale-suggest banner, and offline banner around `children`.
 *
 * `!test`: `DefaultLayout` is an `async` Server Component that `await`s Sanity
 * data (`getSiteSettings`, `getNavigation`, `getSiteSeo`, the announcement +
 * locale-suggest readers) and Next's `cookies()`/`headers()` request APIs.
 * React's client renderer (what Storybook's Vitest browser mode mounts through)
 * can't render an async component at all — "An unknown Component is an async
 * Client Component. Only Server Components can be async at the moment" (see
 * `BlocksShowcase.stories.tsx`, the simplest reproduction of the same limit).
 * Mocking the Sanity readers + `next/headers` wouldn't change that outcome, so
 * it isn't attempted here. Kept for the source/docs view, excluded from the
 * vitest gate.
 */
const meta = {
  title: "Website/Layout/DefaultLayout",
  component: DefaultLayout,
  tags: ["autodocs", "!test"],
  parameters: { layout: "fullscreen" },
  args: { children: <p>Page content</p> },
} satisfies Meta<typeof DefaultLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
