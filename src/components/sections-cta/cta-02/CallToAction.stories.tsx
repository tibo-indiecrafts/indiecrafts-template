import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Cta02Section } from "./index";
import { cta02Sample } from "./config";

const meta: Meta<typeof Cta02Section> = {
  title: "Sections/Cta/Cta02",
  component: Cta02Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Cta02Section>;

export const Default: Story = {
  args: { ...cta02Sample, id: "story-cta-02" } as React.ComponentProps<
    typeof Cta02Section
  >,
};
