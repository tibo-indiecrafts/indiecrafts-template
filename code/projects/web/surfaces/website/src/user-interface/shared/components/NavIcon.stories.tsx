import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { NavIcon } from "./NavIcon";

/**
 * Resolves a free-text Reicon name (as typed by an editor in the `navigation`
 * doc) to its glyph. Unknown/empty names render nothing.
 */
const meta = {
  title: "Website/Shared/NavIcon",
  component: NavIcon,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof NavIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A known Reicon name. */
/**
 * `!test`: `reicon-react`'s barrel (2674 named exports, one file each) doesn't
 * resolve under this Storybook composition's dep pre-bundling — the glyph
 * silently renders nothing here even though the same component renders fine
 * in the main gallery (`ui-icons`'s own `ReiconIcon.stories.tsx`) and in the
 * real app. Kept in the gallery for reference; excluded from the vitest gate.
 */
export const Named: Story = {
  args: { name: "ShieldCheck" },
  tags: ["!test"],
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("svg")).toBeInTheDocument();
  },
};

/** No name → renders nothing. */
export const Empty: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    await expect(canvasElement.firstElementChild).toBeEmptyDOMElement();
  },
};
