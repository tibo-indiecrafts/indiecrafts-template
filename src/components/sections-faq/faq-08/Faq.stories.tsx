import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Faq from "./Faq";
import { faq08Sample } from "./config";

const meta: Meta<typeof Faq> = {
  title: "Sections/Faq/Faq08",
  component: Faq,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Faq>;

export const Default: Story = {
  args: { ...faq08Sample, id: "faq-08-storybook" },
};
