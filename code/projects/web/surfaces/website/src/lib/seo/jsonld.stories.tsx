import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { JsonLdScript, PageSchemas } from "./jsonld";
import { pages } from "@/config";

/**
 * `<JsonLdScript>` renders one `<script type="application/ld+json">` tag — a
 * single schema, or several wrapped in `@graph`. It's the only renderable,
 * synchronous export of this file; `<PageSchemas>` (below) is an `async`
 * Server Component and can't mount in this environment.
 */
const meta = {
  title: "Website/SEO/JsonLdScript",
  component: JsonLdScript,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof JsonLdScript>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One schema object. */
export const SingleSchema: Story = {
  args: {
    data: { "@type": "Article", headline: "Ship a client site in a weekend" },
  },
  play: async ({ canvasElement }) => {
    const script = canvasElement.querySelector('script[type="application/ld+json"]');
    await expect(script).toBeInTheDocument();
    const body = JSON.parse(script?.textContent ?? "{}");
    await expect(body["@context"]).toBe("https://schema.org");
    await expect(body["@type"]).toBe("Article");
    await expect(body.headline).toBe("Ship a client site in a weekend");
  },
};

/** Several schemas → wrapped in `@graph`, one `<script>` tag. */
export const MultipleSchemas: Story = {
  args: {
    data: [
      { "@type": "Article", headline: "Ship a client site in a weekend" },
      { "@type": "BreadcrumbList", itemListElement: [] },
    ],
  },
  play: async ({ canvasElement }) => {
    const script = canvasElement.querySelector('script[type="application/ld+json"]');
    const body = JSON.parse(script?.textContent ?? "{}");
    await expect(body["@graph"]).toHaveLength(2);
  },
};

/**
 * `!test`: `PageSchemas` is an `async` Server Component — it `await`s
 * `getPageSeo` / `getSiteSeo` / `getSiteSettings` / `getFaqItems` (Sanity
 * reads) before returning `<JsonLdScript>`. React's client renderer (what
 * Storybook's Vitest browser mode mounts through) can't render an async
 * component at all — see `BlocksShowcase.stories.tsx` for the same limit's
 * simplest reproduction. Kept for the source/docs view, excluded from the
 * vitest gate.
 */
export const PageSchemasNote: Story = {
  tags: ["!test"],
  render: () => <PageSchemas page={pages.home} locale="en" />,
};
