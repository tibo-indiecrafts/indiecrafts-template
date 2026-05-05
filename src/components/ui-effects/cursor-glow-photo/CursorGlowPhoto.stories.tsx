import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CursorGlowPhoto } from "./CursorGlowPhoto";

const meta: Meta<typeof CursorGlowPhoto> = {
  title: "UI Effects/Hover & Interactions/CursorGlowPhoto",
  component: CursorGlowPhoto,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CursorGlowPhoto>;

export const Default: Story = {};
