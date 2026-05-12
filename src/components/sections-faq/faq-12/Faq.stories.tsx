import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Faq from "./Faq";
import { faq12Sample } from "./config";

const meta: Meta<typeof Faq> = {
  title: "Sections/Faq/Faq12",
  component: Faq,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Faq>;

export const Default: Story = {
  args: { ...faq12Sample, id: "faq-12-storybook" },
};
