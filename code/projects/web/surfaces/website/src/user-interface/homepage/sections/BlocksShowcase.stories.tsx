import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BlocksShowcase } from "./BlocksShowcase";

/**
 * Homepage page-builder blocks showcase — renders the same
 * `@indiecrafts/packages-web-ui-components` block registry the blog body uses, fed by
 * hardcoded demo block payloads (stand-ins for Sanity content).
 *
 * `!test`: `BlocksShowcase` is an `async` Server Component (it `await`s
 * `getTranslations`). React's client renderer (what Storybook's Vitest browser
 * mode mounts through) can't render an async component at all — "An unknown
 * Component is an async Client Component. Only Server Components can be async
 * at the moment." This is a rendering-pathway limitation, not a missing mock;
 * kept here for the source/docs view, excluded from the vitest gate.
 */
const meta = {
  title: "Website/Homepage/BlocksShowcase",
  component: BlocksShowcase,
  tags: ["autodocs", "!test"],
  parameters: { layout: "padded" },
  args: { id: "home-blocks", namespace: "pages.home.blocks.blocks" },
} satisfies Meta<typeof BlocksShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
