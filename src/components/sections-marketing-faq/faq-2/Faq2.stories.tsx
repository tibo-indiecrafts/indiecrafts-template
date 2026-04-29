import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Faq2Section } from "./index";
import { faq2Sample } from "./config";

const meta: Meta<typeof Faq2Section> = {
  title: "Sections/Marketing/Faq/Faq2",
  component: Faq2Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Faq2Section>;

export const Default: Story = {
  args: { ...faq2Sample, id: "story-faq-2" } as React.ComponentProps<typeof Faq2Section>,
};
