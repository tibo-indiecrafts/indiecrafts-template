import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Faq from "./Faq";
import { faq09Sample } from "./config";

const meta: Meta<typeof Faq> = {
  title: "Sections/Faq/Faq09",
  component: Faq,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Faq>;

export const Default: Story = {
  args: { ...faq09Sample, id: "faq-09-storybook" },
};
