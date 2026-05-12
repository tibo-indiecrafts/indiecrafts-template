import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Landing } from "./Landing";

const meta: Meta<typeof Landing> = {
  title: "Pages/CustomerStory/CustomerStory01",
  component: Landing,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Landing>;
export const Default: Story = {};
export const NoFooter: Story = { args: { footer: false } };
export const FullBleed: Story = { args: { layout: "full-bleed" } };
