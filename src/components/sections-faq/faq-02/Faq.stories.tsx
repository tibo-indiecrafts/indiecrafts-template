import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Faq02Section } from "./index";
import { faq02Sample } from "./config";

const meta: Meta<typeof Faq02Section> = {
  title: "Sections/Faq/Faq02",
  component: Faq02Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Faq02Section>;

export const Default: Story = {
  args: { ...faq02Sample, id: "story-faq-02" } as React.ComponentProps<
    typeof Faq02Section
  >,
};
