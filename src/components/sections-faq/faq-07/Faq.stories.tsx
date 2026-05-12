import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Faq from "./Faq";
import { faq07Sample } from "./config";

const meta: Meta<typeof Faq> = {
  title: "Sections/Faq/Faq07",
  component: Faq,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Faq>;

export const Default: Story = {
  args: { ...faq07Sample, id: "faq-07-storybook" },
};
