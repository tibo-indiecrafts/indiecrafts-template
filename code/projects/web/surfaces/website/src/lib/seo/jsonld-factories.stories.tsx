import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFAQPageSchema,
} from "./jsonld-factories";
import { JsonLdScript } from "./jsonld";
import type { SchemaObject } from "./jsonld-core";

/**
 * `jsonld-factories.tsx` exports plain schema-builder FUNCTIONS, not
 * components — there's nothing to render on its own. `SchemaPreview` (below,
 * local to this story file only) is a thin demo wrapper: it calls one factory
 * and renders the result both as visible JSON (so the shape is inspectable in
 * the gallery) and through the real `<JsonLdScript>` renderer (so the
 * `<script>` tag output is exercised too).
 */
function SchemaPreview({ schema }: { schema: SchemaObject }) {
  return (
    <div>
      <pre className="bg-muted overflow-x-auto rounded-md p-4 text-xs">
        {JSON.stringify(schema, null, 2)}
      </pre>
      <JsonLdScript data={schema} />
    </div>
  );
}

const meta = {
  title: "Website/SEO/JsonLdFactories",
  component: SchemaPreview,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof SchemaPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

/** `buildArticleSchema` — Article/BlogPosting, single vs. multiple authors. */
export const Article: Story = {
  args: {
    schema: buildArticleSchema({
      headline: "Ship a client site in a weekend",
      description: "A config-first template cuts the setup to a day.",
      datePublished: "2026-06-01T00:00:00Z",
      authorNames: ["Alex Rivera"],
      url: "https://example.com/blog/ship-a-client-site-in-a-weekend",
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/"headline": "Ship a client site/)).toBeVisible();
    const script = canvasElement.querySelector('script[type="application/ld+json"]');
    const body = JSON.parse(script?.textContent ?? "{}");
    await expect(body.author).toEqual({ "@type": "Person", name: "Alex Rivera" });
  },
};

/** `buildFAQPageSchema` — the highest-ROI rich result. */
export const FAQPage: Story = {
  args: {
    schema: buildFAQPageSchema([
      { question: "Is this a template?", answer: "Yes — config-first, ready to deploy." },
    ]),
  },
  play: async ({ canvasElement }) => {
    const script = canvasElement.querySelector('script[type="application/ld+json"]');
    const body = JSON.parse(script?.textContent ?? "{}");
    await expect(body["@type"]).toBe("FAQPage");
    await expect(body.mainEntity).toHaveLength(1);
  },
};

/** `buildBreadcrumbSchema`. */
export const Breadcrumb: Story = {
  args: {
    schema: buildBreadcrumbSchema([
      { name: "Blog", url: "https://example.com/blog" },
      { name: "Guides", url: "https://example.com/blog/category/guides" },
    ]),
  },
  play: async ({ canvasElement }) => {
    const script = canvasElement.querySelector('script[type="application/ld+json"]');
    const body = JSON.parse(script?.textContent ?? "{}");
    await expect(body.itemListElement).toHaveLength(2);
    await expect(body.itemListElement[0].position).toBe(1);
  },
};
