import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Error } from "./Error";

const meta: Meta<typeof Error> = {
  title: "Pages/Error/Error01",
  component: Error,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Error>;

export const Default: Story = {};

export const FullBleed: Story = { args: { layout: "full-bleed" } };
