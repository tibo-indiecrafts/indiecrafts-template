import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features02Section } from "./index";
import { features02Sample } from "./config";

const meta: Meta<typeof Features02Section> = {
  title: "Sections/Features/Features02",
  component: Features02Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features02Section>;

export const Default: Story = {
  args: { ...features02Sample, id: "story-features-02" } as React.ComponentProps<
    typeof Features02Section
  >,
};
