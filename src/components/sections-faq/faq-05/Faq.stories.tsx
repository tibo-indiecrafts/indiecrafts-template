import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Faq from "./Faq";
import { faq05Sample } from "./config";

const meta: Meta<typeof Faq> = {
  title: "Sections/Faq/Faq05",
  component: Faq,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Faq>;

export const Default: Story = {
  args: { ...faq05Sample, id: "faq-05-storybook" },
};
