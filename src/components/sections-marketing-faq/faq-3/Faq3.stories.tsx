import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Faq3Section } from "./index";
import { faq3Sample } from "./config";

const meta: Meta<typeof Faq3Section> = {
  title: "Sections/Marketing/Faq/Faq3",
  component: Faq3Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Faq3Section>;

export const Default: Story = {
  args: { ...faq3Sample, id: "story-faq-3" } as React.ComponentProps<typeof Faq3Section>,
};
