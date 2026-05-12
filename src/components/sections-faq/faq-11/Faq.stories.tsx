import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Faq from "./Faq";
import { faq11Sample } from "./config";

const meta: Meta<typeof Faq> = {
  title: "Sections/Faq/Faq11",
  component: Faq,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Faq>;

export const Default: Story = {
  args: { ...faq11Sample, id: "faq-11-storybook" },
};
