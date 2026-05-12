import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Faq from "./Faq";
import { faq06Sample } from "./config";

const meta: Meta<typeof Faq> = {
  title: "Sections/Faq/Faq06",
  component: Faq,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Faq>;

export const Default: Story = {
  args: { ...faq06Sample, id: "faq-06-storybook" },
};
