import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Faq from "./Faq";
import { faq10Sample } from "./config";

const meta: Meta<typeof Faq> = {
  title: "Sections/Faq/Faq10",
  component: Faq,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Faq>;

export const Default: Story = {
  args: { ...faq10Sample, id: "faq-10-storybook" },
};
