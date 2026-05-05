import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Faq01Section } from "./index";
import { faq01Sample } from "./config";

const meta: Meta<typeof Faq01Section> = {
  title: "Sections/Faq/Faq01",
  component: Faq01Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Faq01Section>;

export const Default: Story = {
  args: { ...faq01Sample, id: "story-faq-01" } as React.ComponentProps<
    typeof Faq01Section
  >,
};
