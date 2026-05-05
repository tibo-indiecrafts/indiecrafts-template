import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NotFound } from "./NotFound";

const meta: Meta<typeof NotFound> = {
  title: "Pages/NotFound/NotFound01",
  component: NotFound,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof NotFound>;

export const Default: Story = {};
export const FullBleed: Story = { args: { layout: "full-bleed" } };
