import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content02Section } from "./index";
import { content02Sample } from "./config";

const meta: Meta<typeof Content02Section> = {
  title: "Sections/Content/Content02",
  component: Content02Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content02Section>;

export const Default: Story = {
  args: { ...content02Sample, id: "story-content-02" } as React.ComponentProps<
    typeof Content02Section
  >,
};
