import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Faq03Section } from "./index";
import { faq03Sample } from "./config";

const meta: Meta<typeof Faq03Section> = {
  title: "Sections/Faq/Faq03",
  component: Faq03Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Faq03Section>;

export const Default: Story = {
  args: { ...faq03Sample, id: "story-faq-03" } as React.ComponentProps<
    typeof Faq03Section
  >,
};
