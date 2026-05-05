import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Faq04Section } from "./index";
import { faq04Sample } from "./config";

const meta: Meta<typeof Faq04Section> = {
  title: "Sections/Faq/Faq04",
  component: Faq04Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Faq04Section>;

export const Default: Story = {
  args: { ...faq04Sample, id: "story-faq-04" } as React.ComponentProps<
    typeof Faq04Section
  >,
};
