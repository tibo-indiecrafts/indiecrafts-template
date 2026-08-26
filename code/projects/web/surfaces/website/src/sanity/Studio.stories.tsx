import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Studio as StudioComponent } from "./Studio";

/**
 * Client wrapper around `<NextStudio>`, the embedded Sanity Studio at
 * `/studio` — the composed hub Studio for this app + every module/shared
 * schema contribution (`sanity.config.ts`).
 *
 * `!test`, and the real component is referenced by TYPE only (not imported as
 * a value): `./Studio.tsx` imports `../../sanity.config.ts`, which composes
 * every module's Sanity schema contribution. That graph doesn't resolve
 * cleanly under this Storybook config's dependency pre-bundling — several
 * modules' "sanity" subpath entries (e.g. the page-builder, blog, newsletter
 * module contributions) don't resolve here — and crashes the scan for the
 * WHOLE browser session, not just this story, every other website story in
 * the same run. A real `<NextStudio>` mount would also need a live Sanity
 * project (`projectId`/`dataset`) and fetch its schema over the network, well
 * past "mock this component's own deps." A local placeholder stands in below
 * so the gallery still shows something at this path; the real component
 * lives at `./Studio.tsx`, documented here, not exercised.
 */
function StudioPlaceholder(): ReturnType<typeof StudioComponent> {
  return (
    <div className="text-muted-foreground p-8 text-sm">
      Sanity Studio (not rendered in Storybook — see the doc comment in
      Studio.stories.tsx).
    </div>
  );
}

const meta = {
  title: "Website/SEO/Studio",
  component: StudioPlaceholder,
  tags: ["autodocs", "!test"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof StudioPlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
