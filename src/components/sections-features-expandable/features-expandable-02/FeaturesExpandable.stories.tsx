import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable02Section } from "./index";
import { featuresExpandable02Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable02Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable02",
  component: FeaturesExpandable02Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable02Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable02Sample,
    id: "story-features-expandable-02",
  } as React.ComponentProps<typeof FeaturesExpandable02Section>,
};
