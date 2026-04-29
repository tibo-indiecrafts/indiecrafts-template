import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NotFound1 } from "./NotFound1";

const meta: Meta<typeof NotFound1> = {
  title: "Pages/Error/NotFound1",
  component: NotFound1,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof NotFound1>;

export const Default: Story = {};
export const FullBleed: Story = { args: { layout: "full-bleed" } };
